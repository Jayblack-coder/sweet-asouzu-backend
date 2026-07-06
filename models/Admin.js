const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "Super Admin",
        "Sales Manager",
        "Support Staff",
      ],
      default: "Support Staff",
    },
permissions: [
    {
        type: String
    }
],
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Admin",
  adminSchema
);