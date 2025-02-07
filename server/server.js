require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ Import CORS
const nameSearchRoutes = require("./routes/nameSearchRoutes");

const app = express();

// ✅ Enable CORS for frontend requests
app.use(cors({ origin: "http://localhost:3000" })); // Allow only frontend origin
app.use(express.json());

// API Routes
app.use("/api/namesearch", nameSearchRoutes);

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hphvkpn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("✅ MongoDB Connected"))
	.catch((err) => {
		console.error("❌ DB Connection Error:", err);
		process.exit(1);
	});

app.get("/", (req, res) => {
	res.send("NameSafe Backend is Running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
