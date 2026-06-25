const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    otherNames: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    whatsappNumber: {
      type: String,
    },

    address: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
      default: "Nigeria",
    },

    occupation: {
      type: String,
    },

    buyerType: {
      type: String,
      enum: ["Individual", "Company"],
      default: "Individual",
    },

    companyName: {
      type: String,
    },

    identificationType: {
      type: String,
      enum: [
        "National ID",
        "International Passport",
        "Driver License",
        "Voter Card",
      ],
    },

    identificationNumber: {
      type: String,
    },

    identificationDocument: {
      type: String,
    },

    passportPhoto: {
      type: String,
    },

    shops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
      },
    ],

    totalAmountPaid: {
      type: Number,
      default: 0,
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Buyer", buyerSchema);