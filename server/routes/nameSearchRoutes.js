const express = require("express");
const router = express.Router();
const NameSearch = require("../models/NameSearch");

// 🔹 1️⃣ Create a New Name Search
router.post("/", async (req, res) => {
	try {
		const { firstName, lastName, businessName, auditorFileNumbers } = req.body;

		// Ensure at least lastName or businessName is provided
		if (!lastName && !businessName) {
			return res
				.status(400)
				.json({ error: "Must provide lastName or businessName." });
		}

		const newSearch = new NameSearch({
			firstName,
			lastName,
			businessName,
			auditorFileNumbers: auditorFileNumbers || [],
		});

		await newSearch.save();
		res.status(201).json(newSearch);
	} catch (error) {
		res.status(500).json({ error: "Error saving search" });
	}
});

// 🔹 2️⃣ Get All Name Searches
router.get("/", async (req, res) => {
	try {
		const searches = await NameSearch.find();
		res.json(searches);
	} catch (error) {
		res.status(500).json({ error: "Error retrieving searches" });
	}
});

// 🔹 3️⃣ Get a Specific Name Search by ID
router.get("/:id", async (req, res) => {
	try {
		const search = await NameSearch.findById(req.params.id);
		if (!search) return res.status(404).json({ error: "Search not found" });
		res.json(search);
	} catch (error) {
		res.status(500).json({ error: "Error retrieving search" });
	}
});

// 🔹 4️⃣ Update an Existing Search (New Found Documents)
router.put("/:id", async (req, res) => {
	try {
		const { auditorFileNumbers } = req.body;

		const search = await NameSearch.findById(req.params.id);
		if (!search) return res.status(404).json({ error: "Search not found" });

		// Find new documents that were not in the previous search
		const newDocuments = auditorFileNumbers.filter(
			(doc) => !search.auditorFileNumbers.includes(doc)
		);

		if (newDocuments.length > 0) {
			search.auditorFileNumbers.push(...newDocuments);
			search.lastUpdated = new Date();
			await search.save();
			res.json({ message: "New documents added", search });
		} else {
			res.json({ message: "No new documents found", search });
		}
	} catch (error) {
		res.status(500).json({ error: "Error updating search" });
	}
});

// 🔹 5️⃣ Delete a Name Search
router.delete("/:id", async (req, res) => {
	try {
		await NameSearch.findByIdAndDelete(req.params.id);
		res.json({ message: "Search deleted" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting search" });
	}
});

module.exports = router;
