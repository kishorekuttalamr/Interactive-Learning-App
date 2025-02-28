process.env.EMAIL_USER = "curiokidslearning@gmail.com";
process.env.EMAIL_PASS = "amuy vnvt fpjl dnil";


const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
    app.use(cors());
// app.use(cors({
//     origin: "http://localhost:3000", // Adjust for Vite (React)
//     methods: ["POST", "GET"],
//     allowedHeaders: ["Content-Type"]
// }));
app.use(bodyParser.json());

const otpStore = {"arjun@shivakumar.in":123456}; 

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

mongoose.connect("mongodb://localhost:27017/yourDatabase", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

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

// Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
app.post("/send-otp", async (req, res) => {
    console.log("Received request:", req.body); 
    const { email } = req.body;
    // res.json({message:"Received request:", data: req.body})
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOtp();
    otpStore[email] = otp; // Store OTP temporarily
    console.log(otp)
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text:`Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });
    console.log(otpStore)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email]; // Remove OTP after verification
    res.json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));