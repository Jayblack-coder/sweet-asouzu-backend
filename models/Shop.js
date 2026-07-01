const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    // Unique shop identifier
    shopCode: {
  type: String,
  required: true,
  unique: true,
},

location: {
  wing: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F", "G", "H"],
    required: true,
  },

  block: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },

  row: {
    type: String,
    enum: ["Front", "Back"],
    required: true,
  },

  shopNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
},
    shopType: {
      type: String,
      enum: ["Standard", "Premium", "Executive"],
      required: true,
      index: true,
    },

    // Measurements
    length: {
      type: Number,
      required: true,
    },

    width: {
      type: Number,
      required: true,
    },

    area: Number,

    // Pricing
   price: {
  type: Number,
  default: null,
},

    installmentPrice: {
      type: Number,
      default: 0,
    },

    // Availability
    status: {
      type: String,
      enum: [
        "Available",
        "Reserved",
        "Pending Payment",
        "Sold",
      ],
      default: "Available",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // Description
    title: String,

    description: String,

    // Media
    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    videos: [
      {
        url: String,
        public_id: String,
      },
    ],

    virtualTour: String,

    locationMap: String,

    features: [String],

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.pre("save", function () {
  this.area = this.length * this.width;
});
// shopSchema.index({ shopCode: 1 });

shopSchema.index({
    wing: 1,
    block: 1,
});

shopSchema.index({
    shopType: 1,
    status: 1,
});

shopSchema.index({
    featured: 1,
});

module.exports = mongoose.model("Shop", shopSchema);