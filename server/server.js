require("dotenv").config(); // ✅ Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Import Routes
const nameSearchRoutes = require("./routes/nameSearchRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ Initialize Express App
const app = express();

// ✅ Middleware Setup
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend origin
app.use(express.json()); // Parse JSON request bodies

// ✅ API Routes
app.use("/api/namesearch", nameSearchRoutes); // Name Search Routes
app.use("/api/users", userRoutes); // User Routes

// ✅ Database Connection
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hphvkpn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("✅ MongoDB Connected"))
	.catch((err) => {
		console.error("❌ DB Connection Error:", err);
		process.exit(1); // Exit process on DB connection failure
	});

// ✅ Root Endpoint
app.get("/", (req, res) => {
	res.send("NameSafe Backend is Running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
