const express = require("express");
const accountController = require("../controllers/accountController");

const router = express.Router({ mergeParams: true });

router.route("/newAccount").post(accountController.createAccount);
router.route("/verifyAccount/:email").post(accountController.verifyAccount);
router.route("/loginAccount").post(accountController.loginAccount);
router.route("/forgotPassword").post(accountController.forgotPassword);
router.route("/resetPassword/:token").patch(accountController.resetPassword);
router.route("/updateAccount/:accountId").patch(accountController.updateAccount);
router.route("/likedEvent/:eventId/:accountId").patch(accountController.eventLiked);
router.route("/getlikedEventIds/:accId").get(accountController.getAccountEventIds);
router.route("/getAccountByMail/:email").get(accountController.getAccountByEmail);

module.exports = router;
