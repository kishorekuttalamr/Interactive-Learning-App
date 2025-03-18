const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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

module.exports = mongoose.model("User", UserSchema);
