const Shop = require("../models/Shop");
const Buyer = require("../models/Buyer");
const Reservation = require("../models/Reservation");
const Payment = require("../models/Payment");

const getDashboard = async (req, res) => {
  try {
    // =========================
    // SHOP STATISTICS
    // =========================
    const totalShops = await Shop.countDocuments();

    const availableShops = await Shop.countDocuments({
      status: "Available",
    });

    const reservedShops = await Shop.countDocuments({
      status: "Reserved",
    });

    const soldShops = await Shop.countDocuments({
      status: "Sold",
    });

    // =========================
    // BUYERS
    // =========================
    const totalBuyers = await Buyer.countDocuments();

    // =========================
    // RESERVATIONS
    // =========================
    const totalReservations =
      await Reservation.countDocuments();

    const pendingReservations =
      await Reservation.countDocuments({
        status: "Pending",
      });

    const awaitingPayments =
      await Reservation.countDocuments({
        status: "Payment Pending",
      });

    const completedSales =
      await Reservation.countDocuments({
        status: "Completed",
      });

    // =========================
    // PAYMENT SUMMARY
    // =========================
    const payments = await Payment.find({
      status: "Successful",
    });

    let amountReceived = 0;
    let outstandingBalance = 0;

    payments.forEach((payment) => {
      amountReceived += payment.amountPaid || 0;
      outstandingBalance += payment.balance || 0;
    });

    const totalSales =
      amountReceived + outstandingBalance;

    // =========================
    // RECENT RESERVATIONS
    // =========================
    const recentReservations =
      await Reservation.find()
        .populate(
          "buyer",
          "firstName lastName"
        )
        .populate("shop", "shopCode")
        .sort({ createdAt: -1 })
        .limit(10);

    // =========================
    // RECENT PAYMENTS
    // =========================
    const recentPayments =
      await Payment.find()
        .populate(
          "buyer",
          "firstName lastName"
        )
        .populate("shop", "shopCode")
        .sort({ createdAt: -1 })
        .limit(10);

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      success: true,

      totalShops,
      availableShops,
      reservedShops,
      soldShops,

      totalBuyers,

      totalReservations,
      pendingReservations,
      awaitingPayments,
      completedSales,

      totalSales,
      amountReceived,
      outstandingBalance,

      recentReservations,
      recentPayments,
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
  getDashboard,
};
