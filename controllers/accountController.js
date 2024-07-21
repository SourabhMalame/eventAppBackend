const Account = require("../models/accountModel");
require("dotenv").config();
const nodemailer = require("nodemailer");
const Email = require("../utils/email");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');
const nodeCache = new NodeCache()


const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createAccount = async (req, res, next) => {
  try {
    const dataReceived = req.body;
    const account = await Account.create(req.body);
    const obtained = await Account.findOne({
      email: dataReceived.email,
    }).select("otp");

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: dataReceived.email,
      subject: "Verify Your Account",
      text:
        "Your Otp to Verify Your Account is" +
        " " +
        obtained.otp +
        " ." +
        "Don't Share with Anyone",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });

    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not created",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Account created successfully",
      data: account,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Account not created",
      reason: err,
    });
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    let { email } = req.params;
    email = email.split("=")[1];
    const { otp } = req.body;

    const account = await Account.findOne({ email }).select("otp  isVerified");

    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not present",
      });
    }

    if (account.otp !== Number(otp)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    account.isVerified = true;

    await account.save();

    res.status(200).json({
      status: "success",
      message: "Account verified successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Cannot Verify the password",
      reason: err,
    });
  }
};

exports.loginAccount = async (req, res, next) => {
  const { email, password } = req.body;
  const account = await Account.findOne({
    email,
  }).select("+password");

  console.log(email, password);
  console.log(account);

  if (
    !account ||
    !(await account.correctPassword(password, account.password))
  ) {
    return res.status(401).json({
      status: "error",
      message: "Invalid email or password",
    });
  }

  console.log("Account Id " + account._id);

  if (!account.isVerified) {
    return res.status(401).json({
      status: "error",
      message: "Account is not verified",
    });
  }

  //const token = signToken(account._id);

  //console.log(token);
  res.status(200).json({
    status: "success",
    message: "Account LogIn Successfully",
  });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);
  const account = await Account.findOne({ email });

  if (!account) {
    return res.status(404).json({
      status: "error",
      message: "Error while performing action",
    });
  }

  const resetToken = await account.createPasswordResetToken();

  await account.save({ validateBeforeSave: false });

  const url = `http://localhost:3000/login/reset-password/${resetToken}`;

  await new Email(account.email, url).resetPassword();

  res.status(200).json({
    status: "Success",
    message: "Mail send to your inbox",
  });
};

exports.resetPassword = async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("Hashed Token " + hashToken);

  const account = await Account.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!account) {
    return res.status(404).json({
      status: "error",
      message: "Token is invalid or Expired ",
    });
  }

  account.password = req.body.password;
  account.confirmPassword = req.body.confirmPassword;

  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;

  await account.save({ validateBeforeSave: true });

  const token = signToken(account._id);

  res.status(200).json({
    status: "success",
    data: account,
    token,
  });
};

exports.updateAccount = async (req, res, next) => {
  const updateAccount = await Account.findByIdAndUpdate(
    req.params.accountId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateAccount) {
    return res.status(404).json({
      status: "error",
      message: "Error while updating data",
    });
  }
  res.status(200).json({
    status: "success",
    data: updateAccount,
  });
};

exports.eventLiked = async (req, res, next) => {
  const { eventId, accountId } = req.params;
  const { isLiked } = req.body;
  console.log(eventId, isLiked);

  let update;
  if (isLiked) {
    update = { $addToSet: { eventLiked: eventId } };
  } else {
    update = { $pull: { eventLiked: eventId } };
  }

  // const user = await Account.findByIdAndUpdate(req.account._id, update, {
  //   new: true,
  //   runValidators: false,
  // });
  const user = await Account.findByIdAndUpdate(accountId, update, {
    new: true,
    runValidators: false,
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "Error while performing the action",
    });
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECERT);

    const freshUser = await Account.findById(decoded.id);

    if (!freshUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    // ? User have changed his/her password

    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "error",
        message: "User recently changed password! Please log in again.",
      });
    }

    req.account = freshUser;

    next();
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAccountEventIds = async function (req, res, next) {
  const { accId } = req.params;
  const cacheKey = `accountEventIds_${accId}`;
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      data: JSON.parse(cachedData),
    });
  }

  try {
    const account = await Account.findById(accId);
    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
      });
    }

    const eventIds = account.eventLiked;

    // Cache the result with a TTL of 600 seconds (10 minutes)
    nodeCache.set(cacheKey, JSON.stringify(eventIds), 600);

    res.status(200).json({
      status: "success",
      data: eventIds,
    });
  } catch (err) {
    console.error('Error retrieving account event IDs:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to Fetch",
      reason: err.message,
    });
  }
};


exports.getAccountByEmail = async function (req, res, next) {
  const { email } = req.params;
  const cacheKey = `accountByEmail_${email}`;
  const cachedData = nodeCache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({
      status: "success From NodeCache",
      data: JSON.parse(cachedData),
    });
  }

  try {
    const account = await Account.findOne({ email: email }).select("_id email firstName lastName phone");
    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
      });
    }

    // Cache the result with a TTL of 600 seconds (10 minutes)
    nodeCache.set(cacheKey, JSON.stringify(account), 600);

    res.status(200).json({
      status: "success",
      data: account,
    });
  } catch (err) {
    console.error('Error retrieving account by email:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to Fetch",
      reason: err.message,
    });
  }
};

