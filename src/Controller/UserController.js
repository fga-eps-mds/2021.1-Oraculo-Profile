const { User } = require("../Model/User");
const { Department } = require("../Model/Department");
const { Level } = require("../Model/Level");
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
    };

    if (newUserInfo.departmentID === 0) {
      const emptyDepartment = await Department.getEmpty();

      // user is not admin
      newUserInfo.levelID = privilegeTypes.common;

      // all users are inserted to high level department by default
      newUserInfo.departmentID = emptyDepartment.id;
    } else if (newUserInfo.departmentID > 0) {
      newUserInfo.levelID = privilegeTypes.admin;
    } else {
      return res
        .status(400)
        .json({ error: "invalid values for department" });
    }

    // Search for user department and level
    const department = await Department.findOne({
      where: { id: newUserInfo.departmentID },
    });

    const level = await Level.findOne({
      where: { id: newUserInfo.levelID },
    });

    if (
      (!department && newUserInfo.levelID === privilegeTypes.admin) ||
      !level
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

    await newUser.setDepartments([department]);
    await newUser.setLevels([level]);

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
    const allUsers = await User.findAll({
      attributes: ["id", "name", "email", "created_at"],
      include: ["departments", "levels"],
    });
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
      include: ["departments", "levels"],
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: `${error}` });
  }
}

async function getPrivilegeLevels(req, res) {
  const levels = await Level.findAll({
    attributes: ["id", "name"],
  });

  return res.status(200).json(levels);
}

async function updatePassword(req, res) {
  try {
    const user = await User.findByPk(req.decoded.user_id);
    const newPassword = req.body.password;

    if (!newPassword) {
      return res.status(500).json({ error: "password not set" });
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    return res.status(200).json({ message: "password updated sucessfully" });
  } catch (error) {
    console.log(`could not update password: ${error}`);
    return res.status(500).json({ error: "internal error during update password" });
  }
}

async function editUser(req, res) {
  const { name, email, department_id } = req.body;
  const departmentID = Number.parseInt(department_id);

  try {
    const userID = req.decoded.user_id;

    if (!Number.isFinite(departmentID)) {
      return res.status(400).json({ error: "invalid department id" });
    }

    let bShouldGetEmptyDepartment;

    // Verifica se o departamento "none" precisa ser obtido
    if (departmentID > 0) {
      bShouldGetEmptyDepartment = false;
    } else if (departmentID === 0) {
      bShouldGetEmptyDepartment = true;
    } else {
      return res.status(400).json({ error: "invalid values for department" });
    }

    const department = bShouldGetEmptyDepartment
      ? await Department.getEmpty()
      : await Department.findByPk(departmentID);

    if (!department) {
      return res.status(404).json({ error: "department not found" });
    }

    const user = await User.findByPk(userID);

    user.email = email;
    user.name = name;

    await user.setDepartments([department]);
    await user.save();

    const updatedUser = await User.findByPk(userID, {
      include: ["departments", "levels"],
    });

    return res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      department: updatedUser.departments,
      level: updatedUser.levels,
    });
  } catch (error) {
    console.error(`could not update user: ${error}`);
    return res.status(500).json({ error: "Internal error during update user" });
  }
}

async function getUserInfoByID(req, res) {
  try {
    const { id } = req.params;
    const userID = Number.parseInt(id);

    if (!Number.isFinite(userID)) {
      return response.status(500).json({ error: "invalid user id" });
    }
    const user = await User.findByPk(userID, {
      include: ["departments", "levels"],
    });
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
  getPrivilegeLevels,
  updatePassword,
  editUser,
  getUserInfoByID,
};
