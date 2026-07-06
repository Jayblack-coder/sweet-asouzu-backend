const generateReservationNumber = require("../utils/generateReservationNumber");
const Reservation = require("../models/Reservation");
const Shop = require("../models/Shop");



    
const createReservation = async (req, res) => {
  
  try {
    const buyerId = req.buyer._id;
const reservationNumber =
  await generateReservationNumber();

    const {
      shopId,
      paymentOption,
      notes,
    } = req.body;

    // Check shop exists
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Check availability
    if (shop.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: `This shop is currently ${shop.status}`,
      });
    }

    // Prevent duplicate reservations
    const existingReservation =
      await Reservation.findOne({
        buyer: buyerId,
        shop: shopId,
        status: {
          $in: ["Pending", "Approved"],
        },
      });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an active reservation for this shop",
      });
    }

    // Reservation expires after 72 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    // Generate reservation number
//    const reservationNumber = `SAP-${new Date().getFullYear()}-${Math.floor(
//   100000 + Math.random() * 900000
// )}`;
    // Create reservation
    const reservation =
      await Reservation.create({
        buyer: buyerId,
        shop: shopId,
        reservationNumber,
        paymentOption,
        notes,
        expiresAt,
      });

    // Reserve shop
   await Shop.updateOne(
  { _id: shop._id },
  {
    $set: {
      status: "Reserved",
    },
  }
);
    res.status(201).json({
      success: true,
      message: "Shop reserved successfully",
      reservation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getAllReservations = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by reservation status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by payment option
    if (req.query.paymentOption) {
      filter.paymentOption = req.query.paymentOption;
    }

    const totalReservations = await Reservation.countDocuments(filter);

    const reservations = await Reservation.find(filter)
      .populate(
        "buyer",
        "firstName lastName email phone"
      )
      .populate(
        "shop",
        "shopCode shopType location price installmentPrice status"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalReservations / limit),
      totalReservations,
      count: reservations.length,
      reservations,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReservationById = async (req, res) => {
  try {
    // const reservation = await Reservation.findById(
    //   req.params.reservationId
    // )
    //   .populate("shop")
    //   .populate("buyer", "firstName lastName email phone");

    // if (!reservation) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Reservation not found",
    //   });
    // }

    const reservation = await Reservation.findById(req.params.reservationId)
  .populate("shop")
  .populate("buyer");

if (!reservation) {
  return res.status(404).json({
    success: false,
    message: "Reservation not found",
  });
}

    // Ensure the logged-in buyer owns this reservation
    if (
      reservation.buyer._id.toString() !==
      req.buyer._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: true,
      reservation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


    
// 


const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      buyer: req.buyer._id,
    })
      .populate("shop")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Prevent approving a cancelled reservation
    if (reservation.status === "Cancelled") {
  return res.status(400).json({
    success: false,
    message: "Cancelled reservations cannot be approved.",
  });
}

if (reservation.status === "Approved") {
  return res.status(400).json({
    success: false,
    message: "Reservation has already been approved.",
  });
}
    reservation.status = "Approved";

  //  reservation.status = "Approved";

await reservation.save();

// Mark the shop as sold
await Shop.findByIdAndUpdate(
  reservation.shop,
  {
    status: "Sold",
    buyer: reservation.buyer,
  }
);

// Reject all other pending reservations for this shop
await Reservation.updateMany(
  {
    shop: reservation.shop,
    _id: { $ne: reservation._id },
    status: "Pending",
  },
  {
    $set: {
      status: "Rejected",
    },
  }
);

res.status(200).json({
  success: true,
  message: "Reservation approved successfully.",
  reservation,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Prevent cancelling an already cancelled reservation
    if (reservation.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Reservation has already been cancelled.",
      });
    }

    // Don't allow cancelling an already approved reservation
    if (reservation.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Approved reservations cannot be cancelled.",
      });
    }

    reservation.status = "Cancelled";

    await reservation.save();

    await Shop.findByIdAndUpdate(reservation.shop, {
      status: "Available",
      buyer: null,
    });

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully.",
      reservation,
    });

  } catch (error) {
    console.error("Cancel Reservation Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel reservation.",
      error: error.message,
    });
  }
};

const getReservationDetailsAdmin = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate(
        "buyer",
        "firstName lastName email phone"
      )
      .populate("shop");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      reservation,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getReservationById,
  getMyReservations,
  getAllReservations,
  approveReservation,
  cancelReservation,
  getReservationDetailsAdmin,
};