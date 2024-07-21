const express = require("express");
const organiserController = require("../controllers/organiserController");
const accountController = require("../controllers/accountController");

const router = express.Router({ mergeParams: true });

router.use(accountController.protect);

router.route("/createOrganiser").post(organiserController.createOrganiser);

router.route("/updateOrganiser/:id").patch(organiserController.updateData);

module.exports = router;
