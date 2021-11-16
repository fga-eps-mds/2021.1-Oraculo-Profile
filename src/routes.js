const express = require("express");
const UserController = require("./Controller/UserController");
const DepartmentController = require("./Controller/DepartmentController");
const jwt = require("./Utils/JWT");

const router = express.Router();

router.post("/register", jwt.verifyJWT, UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/user/change-password", jwt.verifyJWT, UserController.updatePassword);
router.get("/users/all", jwt.verifyJWT, UserController.getUsersList);
router.get("/user/access-level", jwt.verifyJWT, UserController.getAccessLevel);
router.get("/user/info", jwt.verifyJWT, UserController.getUserInfo);
router.get("/departments", DepartmentController.getAvailableDepartments);
router.get("/levels", UserController.getPrivilegeLevels);
router.get("/user/:id/info", jwt.verifyJWT, UserController.getUserInfoByID);
router.post("/user/edit", jwt.verifyJWT, UserController.editUser);
router.post("/departments", DepartmentController.createDepartment);
router.post("/departments/change-department/:id", DepartmentController.editDepartment);

module.exports = router;
