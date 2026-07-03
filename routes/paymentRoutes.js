const express = require("express");
const router = express.Router();

const protectBuyer = require("../middleware/protectBuyer");

const {
  initializePayment,
  verifyPayment,
  // getBuyerPayments,
  // webhook,
} = require("../controllers/paymentController");

// Buyer initializes payment
router.post(
  "/initialize",
  protectBuyer,
  initializePayment
);

// Buyer verifies payment
router.get(
  "/verify/:reference",
  protectBuyer,
  verifyPayment
);

// Buyer payment history
// router.get(
//   "/my-payments",
//   protectBuyer,
//   getBuyerPayments
// );

// Paystack webhook
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   webhook
// );

module.exports = router;