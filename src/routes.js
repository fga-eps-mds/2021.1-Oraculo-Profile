const express = require("express");
const UserController = require("./Controllers/UserController");
const { verifyJWT } = require("./Utils/JWT");

const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", verifyJWT, UserController.loginUser);

module.exports = router;
