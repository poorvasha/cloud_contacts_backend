const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  name: {
    type: String,
    required: false,
    min: 2,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", userModel);
