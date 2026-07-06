// const axios = require("axios");

// const Payment = require("../models/Payment");
// const Reservation = require("../models/Reservation");
// const Shop = require("../models/Shop");

// // const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET;

// /*
// |--------------------------------------------------------------------------
// | Initialize Payment
// |--------------------------------------------------------------------------
// */
// const initializePayment = async (req, res) => {
//   try {
//     const buyer = req.buyer;

//     // const {
//     //   reservationId,
//     //   amount,
//     //   paymentType, // Full or Installment
//     // } = req.body;
//     const { reservationId } = req.body;

//     const reservation = await Reservation.findById(
//       reservationId
//     ).populate("shop");

//     if (!reservation) {
//       return res.status(404).json({
//         success: false,
//         message: "Reservation not found",
//       });
//     }

//     // Prevent paying another buyer's reservation
//     if (
//       reservation.buyer.toString() !== buyer._id.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // Determine payment type and amount from the reservation
// const paymentType = reservation.paymentOption;

// let amount;

// if (paymentType === "Full") {
//   amount = reservation.shop.price;
// } else {
//   amount = reservation.shop.installmentPrice;
// }

// // Safety check
// if (!amount || amount <= 0) {
//   return res.status(400).json({
//     success: false,
//     message: "Invalid shop price configured.",
//   });
// }

//     const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         email: buyer.email,
//         amount: amount * 100, // Kobo
//         callback_url:
//           process.env.PAYSTACK_CALLBACK_URL,
//         metadata: {
//           reservationId,
//           buyerId: buyer._id,
//           shopId: reservation.shop._id,
//           paymentType,
//         },
//       },
//       {
// //         headers: {
// //   Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
// //   "Content-Type": "application/json",
// // },
// headers: {
//   Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
// }
//       }
//     );

//     // await Payment.create({
//     //   buyer: buyer._id,
//     //   reservation: reservationId,
//     //   shop: reservation.shop._id,
//     //   amount,
//     //   paymentType,
//     //   reference: response.data.data.reference,
//     //   status: "Pending",
//     // });
//    await Payment.create({
//   buyer: buyer._id,
//   reservation: reservationId,
//   shop: reservation.shop._id,

//   paymentReference: response.data.data.reference,

//   paymentType,

//   // Actual amount being paid now
//   amountPaid: amount,

//   // Total cost of the shop
//   totalAmount: reservation.shop.price,

//   // Remaining balance
//   balance: reservation.shop.price - amount,

//   transactionReference: response.data.data.reference,

//   status: "Pending",
// });

//     res.json({
//       success: true,
//       authorization_url:
//         response.data.data.authorization_url,
//       reference: response.data.data.reference,
//     });
//   } catch (error) {
//     console.error(error.response?.data || error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to initialize payment",
//     });
//   }
// };

// // /*
// // |--------------------------------------------------------------------------
// // | Verify Payment
// // |--------------------------------------------------------------------------
// // */
// // const verifyPayment = async (req, res) => {
  
// //   try {
// //     const { reference } = req.params;

// //     const response = await axios.get(
// //       `https://api.paystack.co/transaction/verify/${reference}`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
// //         },
// //       }
// //     );

// //     const paymentData = response.data.data;

// //    const payment = await Payment.findOne({
// //   paymentReference: reference,
// // });

// //     if (!payment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Payment not found",
// //       });
// //     }

// //     // Prevent verifying the same payment twice
// // if (payment.status === "Successful") {
// //   return res.json({
// //     success: true,
// //     message: "Payment has already been verified."
// //   });
// // }

// //     if (paymentData.status === "success") {
// //       // payment.status = "Successful";

// //       // payment.paidAt = new Date();

// //       // await payment.save();
// //       payment.status = "Successful";

// // payment.amountPaid = payment.totalAmount;

// // payment.balance = 0;

// // payment.paidAt = new Date();

// // payment.gatewayResponse = paymentData;

// // await payment.save();

// /*
// |--------------------------------------------------------------------------
// | Verify Payment
// |--------------------------------------------------------------------------
// */
// const verifyPayment = async (req, res) => {
//   try {
//     const { reference } = req.params;

//     // Find payment in our database
//     const payment = await Payment.findOne({
//       paymentReference: reference,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     // Prevent duplicate verification
//     if (payment.status === "Successful") {
//       return res.json({
//         success: true,
//         message: "Payment has already been verified.",
//       });
//     }

//     // Verify with Paystack
//     const response = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//         },
//       }
//     );

//     const paymentData = response.data.data;

//     // Payment failed on Paystack
//     if (paymentData.status !== "success") {
//       payment.status = "Failed";
//       payment.gatewayResponse = paymentData;

//       await payment.save();

//       return res.status(400).json({
//         success: false,
//         message: "Payment failed.",
//       });
//     }

//     // ===========================
//     // Update Payment
//     // ===========================

//     payment.status = "Successful";
//     payment.amountPaid = payment.totalAmount;
//     payment.balance = 0;
//     payment.paidAt = new Date();
//     payment.transactionReference = paymentData.reference;
//     payment.gatewayResponse = paymentData;
// // Recalculate balance
// payment.balance =
//   payment.totalAmount - payment.amountPaid;

// await payment.save();
//     // await payment.save();

// //       const reservation =
// //         await Reservation.findById(
// //           payment.reservation
// //         );

// //       reservation.paymentStatus = "Paid";

// //       reservation.status = "Approved";

// //       await reservation.save();

// //       const shop = await Shop.findById(
// //         payment.shop
// //       );

// //       shop.status = "Sold";

// //       shop.buyer = reservation.buyer;

// //       await shop.save();

// //       return res.json({
// //         success: true,
// //         message: "Payment verified successfully",
// //       });
// //     }

// //     payment.status = "Failed";

// //     await payment.save();

// //     return res.status(400).json({
// //       success: false,
// //       message: "Payment failed",
// //     });
// //   } catch (error) {
// //     console.error(error.response?.data || error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Verification failed",
// //     });
// //   }
// // };
//  // ===========================
//     // Update Reservation
//     // ===========================

//     const reservation = await Reservation.findById(
//       payment.reservation
//     );

//     // if (reservation) {
//     //   reservation.paymentStatus = "Paid";
//     //   reservation.status = "Approved";

//     //   await reservation.save();
//     // }

//    if (payment.balance <= 0) {
//   reservation.paymentStatus = "Paid";
//   reservation.status = "Completed";
// } else {
//   reservation.paymentStatus = "Partially Paid";
//   reservation.status = "Approved";
// }

// await reservation.save();
//     // ===========================
//     // Update Shop
//     // ===========================

//     const shop = await Shop.findById(payment.shop);

//     // if (shop) {
//     //   shop.status = "Sold";
//     //   shop.buyer = payment.buyer;

//     //   await shop.save();
//     // }

//     if (payment.balance <= 0) {
//   shop.status = "Sold";
// } else {
//   shop.status = "Pending Payment";
// }

// shop.buyer = reservation.buyer;

// await shop.save();

//     return res.json({
//       success: true,
//       message: "Payment verified successfully.",
//     });

//   } catch (error) {
//     console.error(error.response?.data || error);

//     return res.status(500).json({
//       success: false,
//       message: "Verification failed.",
//     });
//   }
// };

// module.exports = {
//   initializePayment,
//   verifyPayment,
// };