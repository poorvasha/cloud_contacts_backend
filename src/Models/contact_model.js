const mongoose = require("mongoose");

const contactModel = mongoose.Schema({
  name: {
    type: String,
    required: false,
    min: 2,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("contacts", contactModel);
