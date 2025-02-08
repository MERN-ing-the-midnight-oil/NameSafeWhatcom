const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
	const { email, name } = req.body;

	try {
		const user = new User({ email, name });
		await user.save();
		res.status(201).json({ message: "User registered successfully!", user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Get user data by email
router.get("/:email", async (req, res) => {
	const { email } = req.params;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ error: "User not found!" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update searches used
router.put("/:email/search", async (req, res) => {
	const { email } = req.params;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ error: "User not found!" });
		}

		if (user.searchesUsed >= user.maxSearches) {
			return res.status(403).json({ error: "Search limit reached!" });
		}

		user.searchesUsed += 1; // Increment searches used
		await user.save();

		res.status(200).json({ message: "Search count updated!", user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
