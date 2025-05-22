const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const getImageFileType = require("../utils/getImageFileType");
const Session = require("../models/session.model");

exports.register = async (req, res) => {
	try {
		const { login, password, phoneNumber } = req.body;
		const fileType = req.file ? await getImageFileType(req.file) : "unknown";

		if (
			login &&
			typeof login === "string" &&
			password &&
			typeof password === "string" &&
			phoneNumber &&
			typeof phoneNumber === "string" &&
			req.file &&
			["image/png", "image/jpeg", "image/gif", "image/jpg"].includes(fileType)
		) {
			const userWithLogin = await User.findOne({ login });
			if (userWithLogin) {
				res.status(409).send({ message: "User with this login already exist" });
				return;
			}
			const user = await User.create({
				login,
				password: await bcrypt.hash(password, 10),
				avatar: req.file.filename,
				phoneNumber,
			});
			res.status(201).send({ message: "User created " + user.login });
		} else {
			res.status(400).send({ message: "Bad request" });
		}
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { login, password } = req.body;
		if (
			login &&
			typeof login === "string" &&
			password &&
			typeof password === "string"
		) {
			const user = await User.findOne({ login });

			if (!user) {
				res.status(400).send("Login or password are incorrect");
			} else {
				if (bcrypt.compareSync(password, user.password)) {
					req.session.user = {
						id: user._id,
						login: user.login,
					};
					res.status(200).send({ _id: user._id, login: user.login });
				} else {
					res.status(400).send("Login or password are incorrect");
				}
			}
		} else {
			res.status(400).send("Enter login and password");
		}
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.logOut = async (req, res) => {
	try {
		req.session.destroy(async (err) => {
			if (err) {
				return res.status(500).send({ message: "Logout failed" });
			}
			res.clearCookie("connect.sid");

			if (process.env.NODE_ENV !== "production") {
				await Session.deleteMany({});
			}

			return res.status(200).send({ message: "Logged out successfully" });
		});
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.getUser = async (req, res) => {
	res.send("You are logged in");
};
