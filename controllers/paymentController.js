const Razorpay = require("razorpay");
const Payment = require("../models/paymentModel");

require("dotenv").config()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEYID,
    key_secret: process.env.RAZORPAY_KEYSECRET,
});

exports.createOrder = async (req, res) => {
    try {
        // Convert amount to paise for Razorpay API
        const amountInRupees = req.body.amount; // Amount in rupees
        const amountInPaisa = amountInRupees * 100; // Convert rupees to paise

        const options = {
            amount: amountInRupees, // amount in paise
            currency: "INR",
            receipt: `receipt#${Math.floor(Math.random() * 10000)}`,
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);
        console.log(order.status);

        // Save payment data in rupees
        const payment = await Payment.create({
            accountId: req.body.accountId,
            orderId: order.id,
            amount: amountInRupees, // Store amount in rupees
            currency: options.currency,
            status: "created",
        });

        res.status(201).json({
            status: "success",
            data: {
                order: {
                    ...order,
                    amount: amountInRupees, // Convert order amount to rupees
                },
                payment,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "fail",
            message: error.message,
            error,
        });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId, orderId, status, amount } = req.body;

        const payment = await Payment.findOneAndUpdate(
            { orderId },
            { paymentId, status, amount },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                status: "fail",
                message: "Payment not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                payment,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
};
