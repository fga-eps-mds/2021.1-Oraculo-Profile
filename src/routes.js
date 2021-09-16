const express = require("express");
const ProfileController = require("./Controllers/ProfileController");
const { verifyJWT } = require("./utils/JWSfunctions");

const router = express.Router();

router.get("/users", verifyJWT, ProfileController.acess);
router.post("/users", verifyJWT, ProfileController.create);
router.put("/users/:id", verifyJWT, ProfileController.update);
router.delete("/users/:id", verifyJWT, ProfileController.delete);

module.exports = router;
