const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String, // could be a URL or a base64 string
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
