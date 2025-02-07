const mongoose = require("mongoose");

// Define NameSearch Schema
const NameSearchSchema = new mongoose.Schema({
	firstName: { type: String, trim: true }, // Optional
	lastName: { type: String, required: true, trim: true }, // Required for searches
	businessName: { type: String, trim: true }, // Optional alternative to name search
	auditorFileNumbers: { type: [String], default: [] }, // List of found documents
	lastUpdated: { type: Date, default: Date.now }, // Track last search update
});

// Create a Mongoose Model
const NameSearch = mongoose.model("NameSearch", NameSearchSchema);

module.exports = NameSearch;
