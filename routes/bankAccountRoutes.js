const express = require("express");
const bankAccountController = require("../controllers/bankAccountController");

const router = express.Router();

router
    .route("/")
    .post(bankAccountController.createBankAccount)
    .get(bankAccountController.getAllBankAccounts);

router
    .route("/:id")
    .get(bankAccountController.getBankAccountById)
    .patch(bankAccountController.updateBankAccount)
    .delete(bankAccountController.deleteBankAccount);

module.exports = router;
