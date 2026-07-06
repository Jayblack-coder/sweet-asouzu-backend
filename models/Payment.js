const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },

    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },

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

    paymentType: {
      type: String,
      enum: ["Full", "Installment"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "Paystack",
        "Flutterwave",
        "Bank Transfer",
        "Cash",
      ],
      default: "Paystack",
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    installmentNumber: {
      type: Number,
      default: 1,
    },

    transactionReference: {
      type: String,
      default: "",
    },

    gatewayResponse: {
      type: Object,
      default: {},
    },

    adminNote: {
  type: String,
  default: "",
},
    
    status: {
      type: String,
      enum: [
        "Pending",
        "Successful",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    paidAt: Date,

    remarks: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);