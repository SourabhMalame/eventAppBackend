const Account = require("../models/accountModel");
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    await Account.updateMany(
      { otpExpires: { $gt: now }, isVerified: false },
      {
        $unset: {
          otp: "",
          otpExpires: "",
        },
      }
    );
    console.log("Expired Otp removed");
  } catch (err) {
    console.log("Error while removing otp ", err);
  }
});
