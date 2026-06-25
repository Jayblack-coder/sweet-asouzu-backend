const Reservation = require("../models/Reservation");
const Shop = require("../models/Shop");

const { randomUUID } = require("crypto");

function generateReservationCode() {
  return `SAP-${randomUUID().slice(0, 8).toUpperCase()}`;
}

const createReservation = async (req, res) => {
  try {
    const { buyerId, shopId } = req.body;

    // Find shop
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
        message: "Shop already reserved or sold",
      });
    }

    // Reserve shop
    shop.status = "Reserved";
    await shop.save();

    // Create reservation
    const reservation = await Reservation.create({
      buyer: buyerId,
      shop: shopId,
      reservationCode: generateReservationCode(),
      expiryDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ), // 7 days
      amountExpected: shop.price,
    });

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createReservation,
};