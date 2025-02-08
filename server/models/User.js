const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	accountType: {
		type: String,
		enum: ["free", "paid"], // Allowed values
		default: "free", // Default is free
	},
	maxSearches: {
		type: Number,
		default: 5, // Default limit for free accounts
	},
	searchesUsed: {
		type: Number,
		default: 0, // Track how many searches they've used
	},
	createdAt: {
		type: Date,
		default: Date.now, // Automatically set creation date
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
