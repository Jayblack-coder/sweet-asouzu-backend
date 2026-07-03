const express = require("express");

const router = express.Router();

const {
  createReservation,
  getReservationById,
  getMyReservations
} = require("../controllers/reservationController");

const protectBuyer = require("../middleware/protectBuyer");
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Reservation routes are working",
  });
});

router.get(
  "/my-reservations",
  protectBuyer,
  getMyReservations
);

router.get(
  "/:reservationId",
  protectBuyer,
  getReservationById
);

router.post(
  "/",
  protectBuyer,
  createReservation
);


module.exports = router;