const mongoose = require('mongoose');

// Define the organiser schema
const organiserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'An organiser must have a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'An organiser must have an email'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, 'An organiser must have a phone number'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'An organiser must have an address'],
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    socialLinks: {
        facebook: {
            type: String,
            trim: true,
        },
        twitter: {
            type: String,
            trim: true,
        },
        instagram: {
            type: String,
            trim: true,
        },
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'An organiser must be linked to an account'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create an index for efficient querying
organiserSchema.index({ name: 1, email: 1 });

// Create and export the model
const Organiser = mongoose.model('Organiser', organiserSchema);

module.exports = Organiser;
