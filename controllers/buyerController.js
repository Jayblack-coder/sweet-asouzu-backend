const Buyer = require("../models/Buyer");

const createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);

    res.status(201).json({
      success: true,
      buyer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buyers.length,
      buyers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyer.findById(
      req.params.id
    );

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    res.status(200).json({
      success: true,
      buyer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    res.status(200).json({
      success: true,
      buyer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findById(
      req.params.id
    );

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    await buyer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Buyer deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBuyer,
  getBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
};