const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const imageUpload = require("../utils/imageupload");

const ads = require("../contrellers/ads.controller");

router.get("/getAll", ads.getAll);
router.get("/getById/:id", ads.getById);
router.get("/getBySearchPhrase/:searchPhrase", ads.getBySearchPhrase);
router.post("/create", authMiddleware, imageUpload.single("image"), ads.create);
router.put("/update/:id", authMiddleware, ads.update);
router.delete("/delete/:id", authMiddleware, ads.delete);

module.exports = router;
