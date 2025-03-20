const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    status: {type:String, default:"pending"}
})

module.exports = mongoose.model("Request", requestSchema)