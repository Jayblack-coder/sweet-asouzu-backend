const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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

    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },

    paymentCode: {
      type: String,
      unique: true,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "Bank Transfer",
        "Paystack",
        "Flutterwave",
        "Cash",
      ],
      required: true,
    },

    transactionReference: {
      type: String,
    },

    proofOfPayment: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Verified",
        "Rejected",
      ],
      default: "Pending",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    verificationDate: {
      type: Date,
    },

    adminComment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);