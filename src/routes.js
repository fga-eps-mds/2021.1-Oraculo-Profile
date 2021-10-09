const express = require("express");
const UserController = require("./Controller/UserController");
const jwt = require("./Utils/JWT");

const router = express.Router();

router.post("/register", jwt.verifyJWT, UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/users/all", jwt.verifyJWT, UserController.getUsersList);
router.get("/user/access-level", jwt.verifyJWT, UserController.getAccessLevel);
router.get("/user/info", jwt.verifyJWT, UserController.getUserInfo);

module.exports = router;
