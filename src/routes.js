const express = require("express");
const UserController = require("./Controller/UserController");
const jwt = require("./Utils/JWT");

const router = express.Router();

router.post("/register", jwt.verifyJWT, UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/user/reset", jwt.verifyJWT, UserController.updatePassword);
router.get("/users/all", jwt.verifyJWT, UserController.getUsersList);
router.get("/user/access-level", jwt.verifyJWT, UserController.getAccessLevel);
router.get("/user/info", jwt.verifyJWT, UserController.getUserInfo);
router.get("/departments", UserController.getAvailableDepartments);
router.get("/levels", UserController.getPrivilegeLevels);
router.get("/sections", UserController.getAvailableSections);

module.exports = router;
