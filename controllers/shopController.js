const Shop = require("../models/Shop");
const mongoose = require("mongoose");
const createShop = async (req, res) => {
  try {
    // const shop = await Shop.create(req.body);
    req.body.area = req.body.length * req.body.width;

const shop = await Shop.create(req.body);

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID",
      });
    }

    const shop = await Shop.findById(req.params.id);

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

// const mongoose = require("mongoose");


const updateShop = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID",
      });
    }

    // Fields allowed to be updated
    const allowedFields = [
      "price",
      "installmentPrice",
      "title",
      "description",
      "images",
      "videos",
      "virtualTour",
      "locationMap",
      "features",
      "featured",
      "length",
      "width",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Recalculate area if dimensions change
    if (
      updates.length !== undefined ||
      updates.width !== undefined
    ) {
      const currentShop = await Shop.findById(req.params.id);

      if (!currentShop) {
        return res.status(404).json({
          success: false,
          message: "Shop not found",
        });
      }

      const length =
        updates.length ?? currentShop.length;

      const width =
        updates.width ?? currentShop.width;

      updates.area = length * width;
    }

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      updates,
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
      message: "Shop updated successfully",
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

const getShopStatistics = async (req, res) => {
  try {
    const totalShops = await Shop.countDocuments();

    const available = await Shop.countDocuments({
      status: "Available",
    });

    const reserved = await Shop.countDocuments({
      status: "Reserved",
    });

    const sold = await Shop.countDocuments({
      status: "Sold",
    });

    const standard = await Shop.countDocuments({
      shopType: "Standard",
    });

    const premium = await Shop.countDocuments({
      shopType: "Premium",
    });

    const executive = await Shop.countDocuments({
      shopType: "Executive",
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalShops,
        available,
        reserved,
        sold,
        standard,
        premium,
        executive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getShopCategories = async (req, res) => {
  res.status(200).json({
    success: true,
    categories: [
      "Standard",
      "Premium",
      "Executive",
    ],
  });
};

const getFeaturedShops = async (req, res) => {
  try {
    const shops = await Shop.find({
      featured: true,
    }).sort({
      createdAt: -1,
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

const getShopsByLayout = async (req, res) => {
  try {
    const { shopType, wing, block } = req.params;

    const shops = await Shop.find({
      shopType,
      "location.wing": wing,
      "location.block": Number(block),
    }).sort({
      "location.row": 1,
      "location.shopNumber": 1,
    });

    res.status(200).json({
      success: true,
      shopType,
      wing,
      block: Number(block),
      count: shops.length,
      shops,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getNavigation = async (req, res) => {
  try {
    const { shopType, wing, block } = req.params;

    const wings = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
    ];

    let currentWingIndex = wings.indexOf(wing);

    let currentBlock = Number(block);

    let previous = null;
    let next = null;

    let minBlock;
    let maxBlock;

    if (shopType === "Standard") {
      minBlock = 1;
      maxBlock = 2;
    } else if (shopType === "Premium") {
      minBlock = 3;
      maxBlock = 4;
    } else {
      minBlock = 5;
      maxBlock = 6;
    }

    // Previous
    if (currentBlock > minBlock) {
      previous = {
        shopType,
        wing,
        block: currentBlock - 1,
      };
    } else if (currentWingIndex > 0) {
      previous = {
        shopType,
        wing: wings[currentWingIndex - 1],
        block: maxBlock,
      };
    }

    // Next
    if (currentBlock < maxBlock) {
      next = {
        shopType,
        wing,
        block: currentBlock + 1,
      };
    } else if (currentWingIndex < wings.length - 1) {
      next = {
        shopType,
        wing: wings[currentWingIndex + 1],
        block: minBlock,
      };
    }

    res.status(200).json({
      success: true,
      current: {
        shopType,
        wing,
        block: currentBlock,
      },
      previous,
      next,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getShopByCode = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      shopCode: req.params.shopCode.toUpperCase(),
    });

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

// const getShopsByLayout = async (req, res) => {
//   try {
//     const { shopType, wing, block } = req.params;

//     const shops = await Shop.find({
//       shopType,
//       wing,
//       block: Number(block),
//     }).sort({ row: 1, shopNumber: 1 });

//     res.status(200).json({
//       success: true,
//       shopType,
//       wing,
//       block: Number(block),
//       count: shops.length,
//       shops,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const bulkUpdatePrices = async (req, res) => {
  try {
    const { shopType, price, installmentPrice } = req.body;

    const result = await Shop.updateMany(
      {
        shopType,
        status: { $ne: "Sold" }
      },
      {
        price,
        installmentPrice
      }
    );

    res.status(200).json({
      success: true,
      modified: result.modifiedCount,
      message: `${result.modifiedCount} ${shopType} shops updated successfully`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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

  //   const shops = await Shop.find({
  //     $or: [
  //       {
  //        shopCode: {
  //   $regex: keyword,
  //   $options: "i",
  // },
  //       },
  //       {
  //         shopType: {
  //           $regex: keyword,
  //           $options: "i",
  //         },
  //       },
  //       {
  //         status: {
  //           $regex: keyword,
  //           $options: "i",
  //         },
  //       },
  //     ],
  //   });

  const shops = await Shop.find({
  $or: [
    { shopCode: { $regex: keyword, $options: "i" } },
    { shopType: { $regex: keyword, $options: "i" } },
    { status: { $regex: keyword, $options: "i" } },
    { "location.wing": { $regex: keyword, $options: "i" } },
    { "location.row": { $regex: keyword, $options: "i" } },
    { "location.block": Number(keyword) || -1 },
    { "location.shopNumber": Number(keyword) || -1 },
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
  getShopByCode,
  updateShop,
  deleteShop,
  getAvailableShops,
  getShopsByCategory,
  searchShops,

  getShopStatistics,
  getShopCategories,
  getFeaturedShops,
  getShopsByLayout,
  getNavigation,
  bulkUpdatePrices, 
};