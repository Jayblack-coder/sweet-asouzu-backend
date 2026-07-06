const express = require("express");

const router = express.Router();

const {
  createReservation,
  getReservationById,
  getMyReservations,
  getAllReservations,
  approveReservation,
  cancelReservation,
  getReservationDetailsAdmin,
} = require("../controllers/reservationController");
const { protectAdmin } = require("../middleware/adminAuth");
const protectBuyer = require("../middleware/protectBuyer");
// router.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Reservation routes are working",
//   });
// });

// Admin
router.get(
    "/admin",
    protectAdmin,
    getAllReservations
);

router.get(
  "/admin/:id",
  protectAdmin,
  getReservationDetailsAdmin
);

router.patch(
  "/:id/approve",
  protectAdmin,
  approveReservation
);

router.patch(
  "/:id/cancel",
  protectAdmin,
  cancelReservation
);

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