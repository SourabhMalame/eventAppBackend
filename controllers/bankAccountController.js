const BankAccount = require("../models/bankAccount");

// Create a new bank account
exports.createBankAccount = async (req, res) => {
    try {
        const newBankAccount = await BankAccount.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                bankAccount: newBankAccount,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// Get all bank accounts
exports.getAllBankAccounts = async (req, res) => {
    try {
        const bankAccounts = await BankAccount.find();
        res.status(200).json({
            status: "success",
            data: {
                bankAccounts,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// Get a specific bank account by ID
exports.getBankAccountById = async (req, res) => {
    try {
        const bankAccount = await BankAccount.findById(req.params.id);
        if (!bankAccount) {
            return res.status(404).json({
                status: "fail",
                message: "No bank account found with that ID",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                bankAccount,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// Update a bank account by ID
exports.updateBankAccount = async (req, res) => {
    try {
        const bankAccount = await BankAccount.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!bankAccount) {
            return res.status(404).json({
                status: "fail",
                message: "No bank account found with that ID",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                bankAccount,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// Delete a bank account by ID
exports.deleteBankAccount = async (req, res) => {
    try {
        const bankAccount = await BankAccount.findByIdAndDelete(req.params.id);
        if (!bankAccount) {
            return res.status(404).json({
                status: "fail",
                message: "No bank account found with that ID",
            });
        }
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};
