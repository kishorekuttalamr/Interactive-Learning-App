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
  selectedSubjects: [String], // Store selected subjects
});

module.exports = mongoose.model("User", UserSchema);
