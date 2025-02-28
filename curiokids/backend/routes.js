const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/yourDatabase", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Define User Schema
const userSchema = new mongoose.Schema({
  parentName: String,
  parentUsername: String,
  parentPassword: String,
  parentEmail: String,
  childName: String,
  childUsername: String,
  childPassword: String,
  childEmail: String,
  childDob: String,
  preferredSubjects: [String], // Array of subjects
});

const User = mongoose.model("User", userSchema);

// Route to store user data
app.post("/register-user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Start server
app.listen(5001, () => console.log("Server running on port 5001"));
