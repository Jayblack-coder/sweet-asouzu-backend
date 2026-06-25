const Shop = require("../models/Shop");

const createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getShops = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const totalShops = await Shop.countDocuments();

    const shops = await Shop.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalShops / limit),
      totalShops,
      count: shops.length,
      shops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(
      req.params.id
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateShop = async (req, res) => {
  try {
    const shop =
      await Shop.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(
      req.params.id
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    await shop.deleteOne();

    res.status(200).json({
      success: true,
      message: "Shop deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAvailableShops = async (
  req,
  res
) => {
  try {
    const shops = await Shop.find({
      status: "Available",
    });

    res.status(200).json({
      success: true,
      count: shops.length,
      shops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getShopsByCategory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {
      shopType: req.params.type,
    };

    const totalShops =
      await Shop.countDocuments(filter);

    const shops = await Shop.find(filter)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalShops / limit),
      totalShops,
      shops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const searchShops = async (
  req,
  res
) => {
  try {
    const keyword =
      req.query.keyword || "";

    const shops = await Shop.find({
      $or: [
        {
          shopNumber: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          shopType: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          status: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: shops.length,
      shops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  getAvailableShops,
  getShopsByCategory,
  searchShops,
};