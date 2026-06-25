const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    reservationCode: {
      type: String,
      unique: true,
      required: true,
    },

    reservationDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    reservationStatus: {
      type: String,
      enum: [
        "Pending",
        "Reserved",
        "Expired",
        "Cancelled",
        "Completed"
      ],
      default: "Pending",
    },

    amountExpected: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Unpaid",
        "Partially Paid",
        "Paid"
      ],
      default: "Unpaid",
    },

    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Reservation",
  reservationSchema
);