const { User } = require("../Model/User");
const { Department } = require("../Model/Department");
const { Level } = require("../Model/Level");
const { Section } = require("../Model/Section");
const { hashPassword } = require("../Utils/hash");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const privilegeTypes = {
  admin: 1,
  common: 2,
};

async function findUserLevelByID(req) {
  const user = await User.findByPk(req.decoded.user_id, {
    include: {
      association: "levels",
      attributes: ["name", "id"],
    },
    where: { email: req.decoded.email },
  });

  const level = await user.levels[0];

  return level;
}

async function createUser(req, res) {
  if (!req.body.name || !req.body.password || !req.body.email || !req.body.level) {
    return res.status(400).send({
      error: "lacks of information to register user",
    });
  }

  try {
    const rawPassword = req.body.password;

    // check for user permission
    const requesterLevel = await findUserLevelByID(req);

    if (requesterLevel.id != privilegeTypes.admin) {
      return res
        .status(401)
        .json({ error: "you do not have privileges to create a user" });
    }

    const newUserInfo = {
      name: req.body.name,
      password: await hashPassword(rawPassword),
      email: req.body.email,
      departmentID: Number.parseInt(req.body.departmentID),
      levelID: Number.parseInt(req.body.level),
      sectionID: Number.parseInt(req.body.sectionID),
    };

    if (newUserInfo.departmentID === 0 && newUserInfo.sectionID > 0) {
      const emptyDepartment = await Department.getEmpty();

      // user is not admin
      newUserInfo.levelID = privilegeTypes.common;

      // all users are inserted to high level department by default
      newUserInfo.departmentID = emptyDepartment.id;
    } else if (newUserInfo.sectionID === 0 && newUserInfo.departmentID > 0) {
      const emptySection = await Section.getEmpty();

      newUserInfo.levelID = privilegeTypes.admin;
      newUserInfo.sectionID = emptySection.id;
    } else {
      return res
        .status(400)
        .json({ error: "invalid values for department ID or sectionID" });
    }

    // Search for user department and level
    const department = await Department.findOne({
      where: { id: newUserInfo.departmentID },
    });

    const level = await Level.findOne({
      where: { id: newUserInfo.levelID },
    });

    const section = await Section.findOne({ where: { id: newUserInfo.sectionID } });
    if (
      (!department && newUserInfo.levelID === privilegeTypes.admin) ||
      !level ||
      !section
    ) {
      return res.status(400).send({ error: "invalid user information provided" });
    }

    const newUser = await User.create({
      name: newUserInfo.name,
      email: newUserInfo.email,
      password: newUserInfo.password,
    });

    if (!newUser) {
      return res.status(500).send({ error: "could not insert user" });
    }

    await newUser.addDepartment(department);
    await newUser.addLevel(level);
    await newUser.addSection(section);

    return res.status(200).send(newUser);
  } catch (error) {
    console.log(`could not create user: ${error}`);
    return res.status(500).json({ error: "internal error during user register" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "missing login information" });
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user.id, email }, process.env.SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ auth: true, token });
    }

    return res.status(401).json({ error: "invalid credentials" });
  } catch (err) {
    console.error(`could not perform login: ${err}`);
    return res.status(500).json({ error: `could not login user: ${err}` });
  }
}

async function getUsersList(req, res) {
  const user = await User.findByPk(req.decoded.user_id, {
    include: {
      association: "levels",
    },
    where: { email: req.decoded.email },
  });

  const level = user.levels[0];

  if (level.id === privilegeTypes.admin) {
    const allUsers = await User.findAll({ attributes: ["email", "created_at"] });
    return res.status(200).json(allUsers);
  }

  return res.status(401).json({ error: "you don't have permissions to list all users" });
}

async function getAccessLevel(req, res) {
  try {
    const level = await findUserLevelByID(req);
    return res.status(200).json(level);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
}

async function getUserInfo(req, res) {
  try {
    const userID = Number.parseInt(req.decoded.user_id, 10);

    const user = await User.findByPk(userID, {
      attributes: ["id", "name", "email", "created_at", "updated_at"],
      include: [{ association: "sections", attributes: ["id", "name"] }],
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
}

async function getAvailableDepartments(req, res) {
  const departments = await Department.findAll({
    attributes: ["id", "name"],
    where: {
      name: {
        [Op.not]: "none",
      },
    },
  });
  return res.status(200).json(departments);
}

async function getPrivilegeLevels(req, res) {
  const levels = await Level.findAll({
    attributes: ["id", "name"],
  });

  return res.status(200).json(levels);
}

async function getAvailableSections(req, res) {
  Section.findAll({
    attributes: ["id", "name"],
    where: {
      name: {
        [Op.not]: "none",
      },
    },
  }).then((sections) => {
    return res.status(200).json(sections);
  });
}

async function updatePassword(req, res) {
  try {
    const user = User.findByPk(req.decoded.user_id);
    const newPassword = req.body.password;

    if (!newPassword) {
      return res.status(500).json({ error: "Not insert password" });
    }

    user.password = hashPassword(newPassword);

    (await user).save();
    return res.status(200).send("Password reset sucessfully.");
  } catch (error) {
    return res.status(500).json({ error: "Internal error during update password" });
  }
}

async function updateUser(req, res) {
  try {
    const userID = req.decoded.user_id;

    const newUserInfo = {
      name: req.body.name,
      email: req.body.email,
      sectionID: Number.parseInt(req.body.section_id),
    };

    if (!Number.isFinite(newUserInfo.sectionID)) {
      return res.status(400).json({ error: "invalid department id" });
    }

    const section = await Section.findByPk(newUserInfo.sectionID);
    if (!section) {
      return res.status(404).json({ error: "department not found" });
    }

    const user = await User.findByPk(userID);

    user.email = newUserInfo.email;
    user.name = newUserInfo.name;
    user.sectionID = newUserInfo.sectionID;

    user.addSection(newUserInfo.sectionID);

    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`could not update user: ${error}`);
    return res.status(500).json({ error: "Internal error during update user" });
  }
}

async function getUserByID(req, res) {
  try {
    const { id } = req.params;
    const userID = Number.parseInt(id);

    if (!Number.isFinite(userID)) {
      return response.status(500).json({ error: "invalid user id" });
    }
    const user = await User.findByPk(userID);
    const requesterLevel = await findUserLevelByID(req);

    if (requesterLevel.id !== privilegeTypes.admin) {
      return res.status(200).json({ name: user.name });
    } else {
      return res.status(200).json({ user });
    }
  } catch (error) {
    console.log(` Couldn't find user: ${error}`);
    return res.status(500).json({ message: "Internal error during search user" });
  }
}

module.exports = {
  createUser,
  loginUser,
  getUsersList,
  getAccessLevel,
  getUserInfo,
  getAvailableDepartments,
  getPrivilegeLevels,
  getAvailableSections,
  updatePassword,
  updateUser,
  getUserByID,
};
