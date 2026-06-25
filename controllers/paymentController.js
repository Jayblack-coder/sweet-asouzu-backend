const Payment = require("../models/Payment");
const Reservation = require("../models/Reservation");
const Shop = require("../models/Shop");
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { comment } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.paymentStatus === "Verified") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    payment.paymentStatus = "Verified";
    payment.verificationDate = new Date();
    payment.adminComment = comment;
    payment.verifiedBy = req.admin.id;
payment.verificationDate = new Date();
payment.adminComment = comment;

    await payment.save();

    // reservation update logic continues here...

    // Find reservation
    const reservation = await Reservation.findById(
      payment.reservation
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Add payment amount
    reservation.amountPaid += payment.amount;

    // Partial payment
    if (
      reservation.amountPaid <
      reservation.amountExpected
    ) {
      reservation.paymentStatus = "Partially Paid";
    }

    // Full payment
    if (
      reservation.amountPaid >=
      reservation.amountExpected
    ) {
      reservation.paymentStatus = "Paid";
      reservation.reservationStatus = "Completed";

      const shop = await Shop.findById(
        reservation.shop
      );

      if (shop) {
        shop.status = "Sold";
        await shop.save();
      }
    }

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createPayment,
  verifyPayment,
};