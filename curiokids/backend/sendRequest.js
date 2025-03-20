require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const Request = require("./models/Request")

const router = express.Router();
router.use(json())
router.use(cors({
    origin: "http://localhost:3001", // Use frontend's URL instead of '*'
    credentials: true, // Allow cookies and authentication headers
  }));

mongoose.connect("mongodb://localhost:27017/curiokids", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.post("/send-request", async (req, res)=>{
    try{
    const {senderId, receiverId} = req.query;

    if (!senderId||!receiverId){
        return res.status(400).json({message:"Missing required fields"});
    }
    
    await new Request({
        senderId:senderId,
        receiverId:receiverId
    }).save();  
        res.status(201).json({ message: "Request sent successfully"});
    }catch(error){
        console.log("Error sending request",error);
        res.status(500).json({error:error.message});
    }
});

module.exports = router;