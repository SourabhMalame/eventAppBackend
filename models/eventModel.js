const mongoose = require("mongoose");

// Define schema for event form data
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: String, // Consider using Date type for more precise date-time handling
  },
  startTime: {
    type: String, // Consider using Date type for more precise time handling
  },
  endTime: {
    type: String, // Consider using Date type for more precise time handling
  },
  location: {
    type: String,
  },
  apartment: {
    type: String,
  },
  region: {
    type: String,
  },
  venueName: {
    type: String,
  },
  ticketPrice: {
    type: Number,
  },
  isFree: {
    type: Boolean,
  },
  capacity: {
    type: Number,
  },
  instructions: {
    type: String,
  },
  thingsToCarry: {
    type: [String],
  },
  foodNeeds: {
    type: [String],
  },
  utilities: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

// Create model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
