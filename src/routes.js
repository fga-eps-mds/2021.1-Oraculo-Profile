const express = require("express");
const UserController = require("./Controller/UserController");
const SectionController = require("./Controller/SectionController");
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
router.get("/sections", SectionController.getAvailableSections);
router.get("/user/:id/info", jwt.verifyJWT, UserController.getUserInfoByID);
router.post("/user/change-user", jwt.verifyJWT, UserController.updateUser);
router.post("/sections", SectionController.createSection);
router.post("/departments", DepartmentController.createDepartment);
router.post("/sections/change-section/:id", SectionController.editSection);
router.post("/departments/change-department/:id", DepartmentController.editDepartment);

module.exports = router;
