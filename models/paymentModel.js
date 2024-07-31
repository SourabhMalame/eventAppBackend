const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        // required: true,
    },
    orderId: {
        type: String,
        // required: true,
    },
    paymentId: {
        type: String,
        // required: true,
    },
    amount: {
        type: Number,
        // required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
