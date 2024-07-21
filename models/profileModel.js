const mongoose = require("mongoose");

// Define the address sub-schema
const addressSchema = new mongoose.Schema({
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  country: { type: String },
  zip: { type: String },
  state: { type: String },
});

// Define the profile schema
const profileSchema = new mongoose.Schema({
  blog: {
    type: String,
  },
  cellPhone: {
    type: String,
  },
  company: {
    type: String,
  },
  firstName: {
    type: String,
  },
  homePhone: {
    type: String,
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  jobTitle: {
    type: String,
  },
  lastName: {
    type: String,
  },
  prefix: {
    type: String,
    default: "",
  },
  suffix: {
    type: String,
    default: "",
  },
  website: {
    type: String,
  },
  addresses: {
    home: { type: addressSchema, default: {} },
    billing: { type: addressSchema, default: {} },
    shipping: { type: addressSchema, default: {} },
    work: { type: addressSchema, default: {} },
  },
});

// Create the model from the schema
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
