const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    shopNumber: {
      type: String,
      required: true,
      unique: true,
    },

    section: {
  type: String,
  required: true
},
    category: {
      type: String,
      enum: ["Standard", "Premium", "Executive"],
      required: true,
    },

    length: {
      type: Number,
      required: true,
    },

    width: {
      type: Number,
      required: true,
    },

    area: {
      type: Number,
    },

    price: {
      type: Number,
      required: true,
    },

    installmentPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "available",
        "reserved",
        "pending_payment",
        "sold",
      ],
      default: "available",
    },

    description: {
      type: String,
    },

    images: [String],

    videos: [String],

    locationMap: String,

    features: [String],

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      default: null,
    },
    featured: {
  type: Boolean,
  default: false
},
shopCode: {
  type: String,
  unique: true
}
  },
  {
    timestamps: true,
  }
);

shopSchema.pre("save", function (next) {
  this.area = this.length * this.width;

  if (this.area <= 100) {
    this.category = "Standard";
  } else if (this.area <= 150) {
    this.category = "Premium";
  } else {
    this.category = "Executive";
  }

  next();
});

module.exports = mongoose.model("Shop", shopSchema);