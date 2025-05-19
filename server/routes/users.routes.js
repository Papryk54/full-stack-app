const express = require("express");
const router = express.Router();

const users = require("../contrellers/user.controller");

router.get("/allUsers", users.getAllLoggedUsers);

module.exports = router;
