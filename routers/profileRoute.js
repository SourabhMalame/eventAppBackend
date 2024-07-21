const express = require("express");
const profileController = require("../controllers/profileController");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.use(accountController.protect);

router
  .route("/createContactProfile")
  .post(profileController.createAddressProfile);

router
  .route("/updateProfile/:id/:addressType")
  .patch(profileController.updateAddressProfile);

module.exports = router;
