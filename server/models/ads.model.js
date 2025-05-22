const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	publishDate: { type: Date, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	location: { type: String, required: true },
	sellerInfo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	sellerName: { type: String, required: true },
});

module.exports = mongoose.model("ads", adsSchema);
