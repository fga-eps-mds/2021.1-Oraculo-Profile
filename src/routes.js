const express = require("express");
const UserController = require("./Controllers/UserController");
const { verifyJWT } = require("./Utils/JWT");

const router = express.Router();

router.post("/users", verifyJWT, UserController.create);
router.post("/login", verifyJWT, UserController.login);

module.exports = router;
