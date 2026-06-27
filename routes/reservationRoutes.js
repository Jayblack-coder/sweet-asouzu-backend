const express = require("express");

const router = express.Router();

const {
  createReservation,
} = require("../controllers/reservationController");

const protectBuyer = require("../middleware/protectBuyer");
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Reservation routes are working",
  });
});

router.post(
  "/",
  protectBuyer,
  createReservation
);

module.exports = router;