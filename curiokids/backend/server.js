require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const User = require("./models/User"); // Adjust based on your project structure



const app = express();
// app.use(cors());
app.use(cors({
  origin: "http://localhost:3001", // Use frontend's URL instead of '*'
  credentials: true, // Allow cookies and authentication headers
}));

app.use(cookieParser()); // Enable cookie parsing
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
  parentPassword: String,
  parentEmail: String,
  childName: String,
  childUsername: String,
  childPassword: String,
  childEmail: String,
  childDob: String,
  resetToken: { type: String, default: null }, // For password reset
  selectedSubjects: { type: [String], required: true }, // ✅ Ensuring subjects is stored as an array of strings
  refreshToken: { type: String, default: null },
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

const generateAccessToken = (user)=>{
  // console.log("new access token");
  return jwt.sign(
    { id: user._id, parentEmail: user.parentEmail, childEmail: user.childEmail}, // Payload (user data)
    SECRET_KEY, // Secret key
    { expiresIn: "15m"} 
  );
}

const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id, parentEmail: user.parentEmail, childEmail: user.childEmail}, // Payload (user data)
    REFRESH_SECRET_KEY,
    { expiresIn: "2d" } // Longer lifespan (7 days)
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
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Only use secure in production (HTTPS)
      sameSite: "Lax",
      // maxAge: 10 * 1000, // 15 minutes
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      // maxAge: 340 * 1000, // 7 days
    });


    if (userType === "parent"){
      await User.updateOne(
        {parentUsername:username},
        {$set:{refreshToken : refreshToken}}
      )
    }
    else{
      await User.updateOne(
        {childUsername:username},
        {$set:{refreshToken : refreshToken}}
      )
    }

    res.json({
      message: "Login successful",
      userType,
      username,
      name: userType === "parent" ? user.parentName : user.childName
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken){
    // console.log("missing refresh token");
    return res.status(403).json({ message: "Refresh token required" });
  }

  try{
    const user = await User.findOne({refreshToken: refreshToken});
    const storedToken = user.refreshToken;
    if (!storedToken){
      // console.log("No refresh token in db");
      return res.status(403).json({message: "Refresh Token does not exist"});
    }

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded)=>{
      if (err) {
        // console.log("Invalid token");
        return res.status(403).json({message:"Invalid token"});
      }
      const accesstoken = generateAccessToken(user);
      res.cookie("access_token", accesstoken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Only use secure in production (HTTPS)
        sameSite: "Lax",
        // maxAge: 10 * 1000, // 15 minutes
      });
      res.json(
        {accessToken: accesstoken}
      )
    })
  }catch(error){
    res.status(500).json({ message: `Server error: ${error}` });
  }
});

// const router = express.Router();
app.post("/verify-token", (req, res) => {
  const token = req.cookies.access_token; // Read from HTTP-only cookie
  const name = req.cookies.name;
  // console.log("Name: "+name+" token: "+token);
  if (!token) {
    // console.log("No token");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.status(200).json({ message: "Token is valid", user: decoded });
  });
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


//Fetch details of user
app.get("/fetch-details", async (req, res) => {
  const { username, usertype } = req.query; 
  if (!username) return res.status(400).json({ error: "Username is required" });
  try {
    let user;  // Define user before the if-else block

    if (usertype === "parent") {
      user = await User.findOne({ parentUsername: username }).select(
        "-preferredSubjects -parentPassword -childPassword -resetToken -refreshToken -__v"
      );
    } else {
      user = await User.findOne({ childUsername: username }).select(
        "-preferredSubjects -parentPassword -childPassword -resetToken -refreshToken -__v"
      );
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
});


//Update details of user
app.put("/update-user", async (req, res) => {
  console.log(typeof(req.body.selectedSubjects));
  const { _id, ...updateData } = req.body; // Extract _id separately
  if (!_id) {
    return res.status(400).json({ error: "User ID (_id) is required" });
  }

  // // Convert selectedSubjects to an array if it's a string
  // if (selectedSubjects && typeof selectedSubjects === "string") {
  //   console.log("here");
  //   updateData.selectedSubjects = selectedSubjects.split(",").map((subject) => subject.trim());
  // }
  // console.log(updateData);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, select: "-parentPassword -childPassword -resetToken -refreshToken -__v" } // Exclude sensitive fields
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error updating user", details: error.message });
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

app.get('/search-users', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);

    const users = await User.find({ 
      username: { $regex: query, $options: 'i' } // Case-insensitive search
    }).limit(10);

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// **Start Server**
app.listen(5000, () => console.log("Server running on port 5000"));
