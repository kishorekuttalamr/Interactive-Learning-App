require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json()); // ✅ Ensures the server correctly parses JSON bodies
app.use(cors({ origin: "*" }));

process.env.MONGO_URI = "mongodb://localhost:27017/curiokids";

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connection established!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Define User Schema
const userSchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  parentUsername: { type: String, required: true, unique: true },
  parentPassword: { type: String, required: true },
  parentEmail: { type: String, required: true, unique: true },
  childName: { type: String, required: true },
  childUsername: { type: String, required: true, unique: true },
  childPassword: { type: String, required: true },
  childEmail: { type: String, required: true, unique: true },
  childDob: { type: String, required: true },
  resetToken: { type: String, default: null }, // For password reset
  selectedSubjects: { type: [String], required: true }, // ✅ Ensuring subjects is stored as an array of strings
});

// ✅ Hash passwords before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("parentPassword") && !this.isModified("childPassword")) {
    return next();
  }

  // Hash parent password if modified
  if (this.isModified("parentPassword")) {
    const salt = await bcrypt.genSalt(10);
    this.parentPassword = await bcrypt.hash(this.parentPassword, salt);
  }

  // Hash child password if modified
  if (this.isModified("childPassword")) {
    const salt = await bcrypt.genSalt(10);
    this.childPassword = await bcrypt.hash(this.childPassword, salt);
  }

  next();
});

const User = mongoose.model("User", userSchema);

// ✅ API to Register a New User
app.post("/register", async (req, res) => {
  try {
    console.log("✅ Received request body:", req.body); // Debugging

    const {
      parentName,
      parentUsername,
      parentPassword,
      parentEmail,
      childName,
      childUsername,
      childPassword,
      childEmail,
      childDob,
      selectedSubjects,
    } = req.body;

    if (
      !parentName ||
      !parentUsername ||
      !parentPassword ||
      !parentEmail ||
      !childName ||
      !childUsername ||
      !childPassword ||
      !childEmail ||
      !childDob ||
      !Array.isArray(selectedSubjects)
    ) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required, and subjects must be an array" });
    }

    // 🔍 Debugging: Check for existing users
    const existingUser = await User.findOne({
      $or: [{ parentEmail }, { childEmail }, { parentUsername }, { childUsername }],
    });

    if (existingUser) {
      console.warn("⚠️ User already exists:", existingUser);
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const newUser = new User({
      parentName,
      parentUsername,
      parentPassword,
      parentEmail,
      childName,
      childUsername,
      childPassword,
      childEmail,
      childDob,
      selectedSubjects,
    });

    try {
      await newUser.save();
      console.log("✅ User saved successfully!");
      return res.status(201).json({ message: "User registered successfully!" });
    } catch (dbError) {
      console.error("❌ Database save error:", dbError);
      return res.status(500).json({ error: "Database error: Could not save user" });
    }
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5001, () => {
  console.log("🚀 Server running on port 5001");
});
