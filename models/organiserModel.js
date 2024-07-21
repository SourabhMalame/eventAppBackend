const mongoose = require("mongoose");
const validator = require("validator");

const organizerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter fullname"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Please enter valid email",
    },
  },
  address: {
    type: String,
    required: [true, "Please enter address"],
  },
  phone: {
    type: String,
    required: [true, "Please enter phone number"],
    validate: {
      validator: (value) => validator.isMobilePhone(value, "en-IN"),
      message: "Please enter valid phone number",
    },
  },
  panCard: {
    type: String,
    required: [true, "Please enter pan card number"],
    validate: {
      validator: (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      message: "Please enter a valid PAN card number",
    },
  },
  adharCard: {
    type: String,
    required: [true, "Please enter adhar card number"],
    validate: {
      validator: (value) => validator.isNumeric(value) && value.length === 12,
      message: "Please enter a valid Aadhar card number",
    },
  },
  socialMedia: {
    type: [String],
    required: [true, "Please link at least one social media"],
    validate: {
      validator: (value) => value.length > 0,
      message: "Please link at least one social media",
    },
  },
  organiserType: {
    type: String,
    required: [true, "Please select oraniser type"],
  },
});

const Organizer = mongoose.model("Organizer", organizerSchema);

module.exports = Organizer;
