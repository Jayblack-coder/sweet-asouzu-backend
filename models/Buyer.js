// const mongoose = require("mongoose");

// const buyerSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     otherNames: {
//       type: String,
//       default: "",
//     },

//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//     },

//     phoneNumber: {
//       type: String,
//       required: true,
//     },

//     whatsappNumber: {
//       type: String,
//     },

//     address: {
//       type: String,
//     },

//     state: {
//       type: String,
//     },

//     country: {
//       type: String,
//       default: "Nigeria",
//     },

//     occupation: {
//       type: String,
//     },

//     buyerType: {
//       type: String,
//       enum: ["Individual", "Company"],
//       default: "Individual",
//     },

//     companyName: {
//       type: String,
//     },

//     identificationType: {
//       type: String,
//       enum: [
//         "National ID",
//         "International Passport",
//         "Driver License",
//         "Voter Card",
//       ],
//     },

//     identificationNumber: {
//       type: String,
//     },

//     identificationDocument: {
//       type: String,
//     },

//     passportPhoto: {
//       type: String,
//     },

//     shops: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Shop",
//       },
//     ],

//     totalAmountPaid: {
//       type: Number,
//       default: 0,
//     },

//     verificationStatus: {
//       type: String,
//       enum: ["Pending", "Verified", "Rejected"],
//       default: "Pending",
//     },

//     notes: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Buyer", buyerSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    address: String,

    state: String,

    country: {
      type: String,
      default: "Nigeria",
    },

 role: {
  type: String,
  enum: ["buyer", "manager", "admin"],
  default: "buyer",
},

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
  type: Boolean,
  default: true,
},
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
buyerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// Compare password
buyerSchema.methods.matchPassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

module.exports = mongoose.model(
  "Buyer",
  buyerSchema
);