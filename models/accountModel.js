const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, "Please tell us your name!"],
    },
    email: {
        type: String,
        // required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        // required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    likedEvents: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Event",
        },
    ],
    verified: {
        type: Boolean,
        default: false,
    },
});

accountSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

accountSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

accountSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
