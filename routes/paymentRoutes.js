const express = require("express");
const router = express.Router();

const {
  createPayment,
  verifyPayment,
} = require("../controllers/paymentController");
const authorizeRoles =
require("../middleware/roleMiddleware");
const protect = require(
  "../middleware/authMiddleware"
);

router.post("/", createPayment);


router.put(
  "/verify/:paymentId",
  protect,
  authorizeRoles(
    "Super Admin",
    "Sales Manager"
  ),
  verifyPayment
);

module.exports = router;