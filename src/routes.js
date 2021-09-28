const express = require("express");
const UserController = require("./Controller/UserController");
const jwt = require("./Utils/JWT");

const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/users/all", jwt.verifyJWT, UserController.getUsersList);

module.exports = router;
