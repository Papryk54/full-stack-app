const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const auth = require("../contrellers/auth.controller");
const imageUpload = require("../utils/imageupload");

router.post("/register", imageUpload.single("avatar"), auth.register);
router.post("/login", auth.login);
router.get("/user", authMiddleware, auth.getUser);

module.exports = router;
