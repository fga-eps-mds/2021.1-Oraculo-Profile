const db = require("../models");
const Users = db.users;

exports.create = (req, res) => {
  if (!req.body.email && !req.body.password && !req.body.id) {
    res.status(400).send({
      message: "error users could , all fields are required!",
    });
    return res.status(200).sen({ message: "profile created with success" });
  }

  const creatingUsers = {
    email: req.body.email,
    password: req.body.password,
    permission: req.body.permission,
    id: req.body.id,
  };

  Users.create(creatingUsers)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: "error creating an user" });
    });
};
