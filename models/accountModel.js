const crypto = require("crypto");

const mongoose = require("mongoose");  
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { type } = require("os");

const accountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Field cannot be empty"],
  },
  lastName: {
    type: String,
    required: [true, "Field cannot be empty"],
  },
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter the confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  eventsEnrolled: [
    {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paymentRecipt: {
        type: String,
      },
    },
  ],

  passwordResetToken: String,
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetExpires: Date,
  otp: {
    type: Number,
    default: Math.floor(100000 + Math.random() * 900000),
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  eventLiked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Event",
  },
});

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 14);

  this.confirmPassword = undefined;

  next();
});

accountSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

accountSchema.methods.validateOtp = function () {
  this.otpExpires = Date.now() + 2 * 60 * 1000;
};

accountSchema.methods.createPasswordResetToken = async function () {
  console.log("It is been called");

  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(`Backend ${(resetToken, this.passwordResetToken)}`);

  return resetToken;
};

accountSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimeStamp);

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;







