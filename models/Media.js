// models/Media.js

const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

   key: {
  type: String,
  trim: true,
  unique: true,
  sparse: true,
  default: undefined,
},

    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "home",
        "gallery",
        "hero",
        "shops",
        "general",
      ],
      default: "general",
    },

    galleryCategory: {
  type: String,
  enum: [
    "Shops",
    "Plaza Layout",
    "Exterior",
    "Interior",
    "Facilities",
  ],
  default: "Shops",
},

    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);