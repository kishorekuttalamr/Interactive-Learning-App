require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

process.env.EMAIL_USER = "curiokidslearning@gmail.com";
process.env.EMAIL_PASS = "amuy vnvt fpjl dnil";
const otpStore = {};

const SECRET_KEY = "1cce72e9d5f1b7aac55f022c4d907ef2e89eea4c2be7806ae3ece32bcce47456";
const REFRESH_SECRET_KEY = "61c5b5686b1aa0232e965ac663c82afaad8f743514e86f15782e6bf572a2ffa3";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/curiokids", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  parentName: String,
  parentUsername: String,
  parentPassword: String, // Hashed password
  parentEmail: String,
  childName: String,
  childUsername: String,
  childPassword: String, // Hashed password
  childEmail: String,
  childDob: String,
  preferredSubjects: [String], // Array of subjects
  refreshToken: String
});



// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("childPassword")) {
    const salt = await bcrypt.genSalt(10);
    this.childPassword = await bcrypt.hash(this.childPassword, salt);
  }
  if (this.isModified("parentPassword")) {
    const salt = await bcrypt.genSalt(10);
    this.parentPassword = await bcrypt.hash(this.parentPassword, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);

const generateAccessToken = (user)=>
  jwt.sign(
    { id: user._id, parentEmail: user.parentEmail, childEmail: user.childEmail}, // Payload (user data)
    SECRET_KEY, // Secret key
    { expiresIn: "1h" } 
  );

  const generateRefreshToken = (user) =>
    jwt.sign(
      { id: user._id, parentEmail: user.parentEmail, childEmail: user.childEmail}, // Payload (user data)
      REFRESH_SECRET_KEY,
      { expiresIn: "7d" } // Longer lifespan (7 days)
    );


// **User Registration**
app.post("/register-user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user." });
  }
});

// **User Login**
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ parentUsername: username });
    let userType = "parent";

    if (!user) {
      user = await User.findOne({ childUsername: username });
      userType = "child";
    }
    if (!user) {
      return res.status(401).json({ message: "Account not registered" });
    }

    let isMatch = false;

    if (userType === "parent") {
      isMatch = await bcrypt.compare(password, user.parentPassword);
    } 
    else {
      isMatch = await bcrypt.compare(password, user.childPassword);
    }

    // If password does not match, return an error
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    if (userType === "parent"){
      await User.updateOne(
        {parentUsername:username},
        {$set:{refreshToken : refreshToken}}
      )
    }

    res.json({
      message: "Login successful",
      token,
      refreshToken,
      userType,
      name: userType === "parent" ? user.parentName : user.childName
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/refresh-token", async (req, res) => {
  const {refreshToken} = req.body;
  if (!refreshToken){
    return res.status(403).json({ message: "Refresh token required" });
  }

  try{
    const user = await User.findOne({refreshToken: refreshToken});
    const storedToken = user.refreshToken;
    if (!storedToken){
      return res.status(403).json({message: "Refresh Token does not exist"});
    }

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded)=>{
      if (err) return res.status(403).json({message:"Invalid token"});
      const accesstoken = generateAccessToken(user);
      res.json(
        {accesToken: accesstoken}
      )
    })
  }catch(error){
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// **Generate OTP**
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// **Send OTP**
app.post("/send-otp", async (req, res) => {
  console.log("Received request:", req.body);
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = generateOtp();
  otpStore[email] = otp;
  console.log(otp);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// **Verify OTP**
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email]; // Remove OTP after verification
    res.json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// **Send Reset Password Link**
app.post("/send-reset-link", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ parentEmail: email });

    if (!user) {
      return res.status(404).json({ error: "Email not registered" }); // Send error if email is not found
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    otpStore[email] = resetToken;

    const resetLink = `http://localhost:3001/changepassword?token=${resetToken}&email=${email}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error sending email" });
      }
      res.json({ message: "Reset link sent!" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// **Reset Password**
app.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!otpStore[email] || otpStore[email] !== token) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  try {
    const user = await User.findOne({ parentEmail: email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.parentPassword = await bcrypt.hash(newPassword, salt);

    await user.save();
    delete otpStore[email];

    res.json({ message: "Password successfully reset!" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
});

// **Start Server**
app.listen(5000, () => console.log("Server running on port 5000"));
