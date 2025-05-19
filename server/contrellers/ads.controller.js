const Ads = require("../models/ads.model");
const Session = require("../models/session.model");

exports.getAll = async (req, res) => {
	try {
		const ads = await Ads.find();
		res.json(ads);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.getById = async (req, res) => {
	try {
		const ads = await Ads.findById(req.params.id);
		if (!ads) {
			return res.status(404).json({ message: "Document not Found" });
		}
		res.json(ads);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.getBySearchPhrase = async (req, res) => {
	try {
		const ads = await Ads.find();
		let SearchResult = [];
		ads.map((ad) => {
			if (ad.title.includes(`${req.params.searchPhrase}`)) {
				SearchResult.push(ad);
			}
		});
		res.send(SearchResult);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.create = async (req, res) => {
	try {
		const { title, description, publishDate, price, location, sellerInfo } =
			req.body;
		const image = req.file ? req.file.filename : null;
		const priceNumber = Number(price);
		if (
			title &&
			typeof title === "string" &&
			title.length >= 10 &&
			title.length <= 50 &&
			description &&
			typeof description === "string" &&
			description.length >= 20 &&
			description.length <= 1000 &&
			publishDate &&
			!isNaN(Date.parse(publishDate)) &&
			image &&
			typeof image === "string" &&
			!isNaN(priceNumber) &&
			priceNumber > 0 &&
			location &&
			typeof location === "string" &&
			sellerInfo &&
			typeof sellerInfo === "string"
		) {
			const ads = new Ads({
				title,
				description,
				publishDate: new Date(publishDate),
				image,
				price: priceNumber,
				location,
				sellerInfo,
			});
			await ads.save();
			res.status(201).json({ message: "new Ad created" });
		} else {
			return res.status(400).json({ message: "Invalid input data" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.update = async (req, res) => {
	try {
		const sessionRecord = await Session.findOne({});
		const sessionData = JSON.parse(sessionRecord.session);
		req.session.user = {
			id: sessionData.user.id,
			login: sessionData.user.login,
		};

		const ads = await Ads.findById(req.params.id);
		if (!ads) {
			return res.status(404).json({ message: "Document not Found" });
		}

		if (ads.sellerInfo.toString() === req.session.user.id) {
			const updatedAds = await Ads.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
			});
			res.json(updatedAds);
		} else {
			return res
				.status(403)
				.json({ message: "You are not authorized to edit this ad." });
		}
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.delete = async (req, res) => {
	try {
		const sessionRecord = await Session.findOne({});
		const sessionData = JSON.parse(sessionRecord.session);
		req.session.user = {
			id: sessionData.user.id,
			login: sessionData.user.login,
		};
		const ads = await Ads.findById(req.params.id);
		if (!ads) {
			return res.status(404).json({ message: "Document not Found" });
		}
		if (ads.sellerInfo.toString() === req.session.user.id) {
			await Ads.findByIdAndDelete(req.params.id);
		} else {
			return res
				.status(403)
				.json({ message: "You are not authorized to delete this ad." });
		}
		res.json({ message: "Document deleted" });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};
