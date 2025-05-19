const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../../client/public/uploads"));
	},
	filename: (req, file, cb) => {
		const [name, ext] = file.originalname.split(".");
		cb(null, `${name}-${Date.now()}.${ext}`);
	},
});

const imageUpload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = imageUpload;
