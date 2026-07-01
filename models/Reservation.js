const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
{
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Buyer",
        required:true,
    },

    shop:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        required:true,
    },

   reservationNumber: {
  type: String,
  required: true,
  unique: true,
},

    // status:{
    //     type:String,
    //     enum:[
    //         "Pending",
    //         "Approved",
    //         "Rejected",
    //         "Cancelled",
    //         "Expired"
    //     ],
    //     default:"Pending",
    // },
    
    status: {
  type: String,
  enum: [
    "Pending",
    "Approved",
    "Payment Pending",
    "Completed",
    "Cancelled",
    "Expired",
  ],
  default: "Pending",
},

    paymentOption:{
        type:String,
        enum:[
            "Full",
            "Installment"
        ],
        default:"Full",
    },

    reservedAt:{
        type:Date,
        default:Date.now,
    },

    expiresAt:{
        type:Date,
    },

    notes:String,
},
{
    timestamps:true,
});

module.exports = mongoose.model(
    "Reservation",
    reservationSchema
);