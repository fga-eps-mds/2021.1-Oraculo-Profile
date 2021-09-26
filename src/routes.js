const express = require("express");
const UserController = require("./Controller/UserController");
const { verifyJWT } = require("./Utils/JWT");

const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);

module.exports = router;
