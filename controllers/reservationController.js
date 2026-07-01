const generateReservationNumber = require("../utils/generateReservationNumber");
const Reservation = require("../models/Reservation");
const Shop = require("../models/Shop");



    
const createReservation = async (req, res) => {
  
  try {
    const buyerId = req.buyer._id;
const reservationNumber =
  await generateReservationNumber();

    const {
      shopId,
      paymentOption,
      notes,
    } = req.body;

    // Check shop exists
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Check availability
    if (shop.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: `This shop is currently ${shop.status}`,
      });
    }

    // Prevent duplicate reservations
    const existingReservation =
      await Reservation.findOne({
        buyer: buyerId,
        shop: shopId,
        status: {
          $in: ["Pending", "Approved"],
        },
      });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an active reservation for this shop",
      });
    }

    // Reservation expires after 72 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    // Generate reservation number
//    const reservationNumber = `SAP-${new Date().getFullYear()}-${Math.floor(
//   100000 + Math.random() * 900000
// )}`;
    // Create reservation
    const reservation =
      await Reservation.create({
        buyer: buyerId,
        shop: shopId,
        reservationNumber,
        paymentOption,
        notes,
        expiresAt,
      });

    // Reserve shop
   await Shop.updateOne(
  { _id: shop._id },
  {
    $set: {
      status: "Reserved",
    },
  }
);
    res.status(201).json({
      success: true,
      message: "Shop reserved successfully",
      reservation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReservation,
};