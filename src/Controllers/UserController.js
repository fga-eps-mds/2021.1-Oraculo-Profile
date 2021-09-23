const { application } = require("express");
const db = require("../Models/User");
const Users = db.users;

exports.create = async (req, res) => {
  if (
    !req.body.password &&
    !req.body.email &&
    !req.body.departmentID &&
    !req.body.level &&
    !req.body.sectionID
  ) {
    res.status(400).send({
      message: "error users could , all fields are required!",
    });
    return res.status(200).send({ message: "user created with success" });
  }

  const creatingUsers = {
    permission: req.body.permission,
    password: req.body.password,
    email: req.body.email,
    departmentID: req.body.departmentID,
    level: req.body.level,
    sectionID: req.body.sectionID,
  };

  Users.create(creatingUsers)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: "error creating an user" });
    });
  return res;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id, email }, process.env.SECRET, {
        expiresIn: "1h",
      });

      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

exports.listUser = async () => {
  list
    .findAll({ where: { id: id } })
    .then((todoLists) => {
      res.render("users", { todoLists });
    })
    .catch((err) => console.error(err));
};
