const Account = require("../models/accountModel"); // Assuming you have an Account model
const crypto = require("crypto");

// Create a new account
exports.createAccount = async (req, res) => {
    try {
        const newAccount = await Account.create(req.body);
        console.log(JSON.stringify(newAccount, null, 3))
        res.status(201).json({
            status: "success",
            data: {
                account: newAccount,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Verify account
exports.verifyAccount = async (req, res) => {
    try {
        const account = await Account.findOneAndUpdate(
            { email: req.params.email },
            { verified: true },
            { new: true }
        );
        res.status(200).json({
            status: "success",
            data: {
                account,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Login account
exports.loginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email }).select("+password");

        if (!account || !(await account.correctPassword(password, account.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                account,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const account = await Account.findOne({ email: req.body.email });
        if (!account) {
            return res.status(404).json({
                status: "fail",
                message: "No account found with that email",
            });
        }

        const resetToken = account.createPasswordResetToken();
        await account.save({ validateBeforeSave: false });

        // Send resetToken to user's email (implementation not shown)

        res.status(200).json({
            status: "success",
            message: "Token sent to email",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const account = await Account.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!account) {
            return res.status(400).json({
                status: "fail",
                message: "Token is invalid or has expired",
            });
        }

        account.password = req.body.password;
        account.passwordResetToken = undefined;
        account.passwordResetExpires = undefined;
        await account.save();

        res.status(200).json({
            status: "success",
            data: {
                account,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Update account
exports.updateAccount = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(
            req.params.accountId,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            status: "success",
            data: {
                account,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Like an event
exports.eventLiked = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(
            req.params.accountId,
            { $addToSet: { likedEvents: req.params.eventId } },
            { new: true }
        );
        res.status(200).json({
            status: "success",
            data: {
                account,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Get liked event IDs
exports.getAccountEventIds = async (req, res) => {
    try {
        const account = await Account.findById(req.params.accId).select("likedEvents");
        res.status(200).json({
            status: "success",
            data: {
                likedEvents: account.likedEvents,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// Get account by email
exports.getAccountByEmail = async (req, res) => {
    try {
        const account = await Account.findOne({ email: req.params.email });
        res.status(200).json({
            status: "success",
            data: {
                account,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};
