const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema({
    country: {
        type: String,
       // required: true,
    },
    currency: {
        type: String,
        //required: true,
    },
    method: {
        type: String,
        //required: true,
    },
    accountHolder: {
        type: String,
        required: true,
        //enum: ["Individual", "Company"],
    },
    firstName: {
        type: String,
        //required: function () { return this.accountHolder === "Individual"; },
    },
    lastName: {
        type: String,
        //required: function () { return this.accountHolder === "Individual"; },
    },
    companyName: {
        type: String,
        //required: function () { return this.accountHolder === "Company"; },
    },
    address1: {
        type: String,
       // required: true,
    },
    address2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        //required: true,
        enum: ["Checking", "Savings"],
    },
    bankName: {
        type: String,
        //required: true,
    },
    ifscNumber: {
        type: String,
        //required: true,
    },
    accountNumber: {
        type: String,
        //required: true,
    },
    accountNickname: {
        type: String,
    },
    defaultAccount: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

module.exports = BankAccount;



