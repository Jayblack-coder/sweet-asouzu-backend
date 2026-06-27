const express = require("express");

const router = express.Router();
 router.delete("/test", (req, res) => {
  res.json({
    success: true,
    message: "Delete works",
  });
});
const {
  registerBuyer,
  loginBuyer,
  getBuyerProfile,
  updateBuyerProfile,
  deleteBuyerProfile
} = require("../controllers/buyerController");

const protectBuyer = require("../middleware/protectBuyer");

router.post(
  "/register",
  registerBuyer
);

router.post(
  "/login",
  loginBuyer
);

router.get(
  "/profile",
  protectBuyer,
  getBuyerProfile
);

router.put(
  "/profile",
  protectBuyer,
  updateBuyerProfile
);

router.delete(
  "/profile",
  protectBuyer,
  deleteBuyerProfile
);

module.exports = router;