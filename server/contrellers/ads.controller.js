const Ads = require("../models/ads.model");
const Session = require("../models/session.model");
const getImageFileType = require("../utils/getImageFileType");

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
			if (
				ad.title
					.toUpperCase()
					.includes(`${req.params.searchPhrase.toUpperCase()}`)
			) {
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
		const {
			title,
			description,
			publishDate,
			price,
			location,
			sellerInfo,
			sellerName,
		} = req.body;
		const fileType = req.file ? await getImageFileType(req.file) : "unknown";
		const priceNumber = Number(price);
		if (
			title &&
			typeof title === "string" &&
			title.length >= 10 &&
			title.length <= 50 &&
			description &&
			typeof description === "string" &&
			description.length >= 20 &&
			description.length <= 2000 &&
			publishDate &&
			!isNaN(Date.parse(publishDate)) &&
			req.file &&
			["image/png", "image/jpeg", "image/gif", "image/jpg"].includes(
				fileType
			) &&
			!isNaN(priceNumber) &&
			priceNumber > 0 &&
			location &&
			typeof location === "string" &&
			sellerInfo &&
			typeof sellerInfo === "string" &&
			sellerName &&
			typeof sellerName === "string"
		) {
			const ads = new Ads({
				title,
				description,
				publishDate: new Date(publishDate),
				image: req.file.filename,
				price: priceNumber,
				location,
				sellerInfo,
				sellerName,
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

		const ad = await Ads.findById(req.params.id);
		if (!ad) return res.status(404).json({ message: "Document not Found" });
		if (ad.sellerInfo.toString() !== req.session.user.id)
			return res.status(403).json({ message: "Unauthorized" });

		const { title, description, publishDate, price, location, sellerInfo } =
			req.body;

		const priceNumber = Number(price);
		const image = req.file ? req.file.filename : ad.image;

		if (
			title &&
			description &&
			!isNaN(priceNumber) &&
			priceNumber > 0 &&
			location &&
			sellerInfo
		) {
			const updatedAd = await Ads.findByIdAndUpdate(
				req.params.id,
				{
					title,
					description,
					publishDate: publishDate ? new Date(publishDate) : ad.publishDate,
					price: priceNumber,
					location,
					sellerInfo,
					sellerName,
					image,
				},
				{ new: true }
			);
			return res.json(updatedAd);
		} else {
			return res.status(400).json({ message: "Invalid input data" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
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
