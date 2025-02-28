require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

process.env.MONGO_URI = "mongodb://localhost:27017/curiokids";

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connection established!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Dynamic schema to store any user data
const userSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // Stores all user data dynamically
});

const User = mongoose.model("User", userSchema);

// API to save user data
app.post("/saveUserbackend", async (req, res) => {
  try {
    console.log("✅ Received POST request with data:", req.body);
    
    const user = new User({ data: req.body }); // Save entire request body
    await user.save();

    res.status(201).json({ message: "User saved successfully", savedData: req.body });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});

app.listen(5001, () => {
  console.log("🚀 Server running on port 5001");
});
