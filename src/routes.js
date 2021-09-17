const express = require("express");
const ProfileController = require("./Controllers/ProfileController");
const { verifyJWT } = require("./utils/JWSfunctions");

const router = express.Router();

router.post("/users:id", verifyJWT, ProfileController.create);

module.exports = router;
