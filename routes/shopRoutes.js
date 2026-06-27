const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/shopController");

// console.log({
//   getShopsByLayout,
//   getNavigation,
// });
console.log(typeof bulkUpdatePrices);
router.get("/test", (req, res) => {
  res.json({ message: "Shop routes are working" });
});
// CREATE
router.post("/", createShop);


// READ
router.get("/", getShops);

router.get("/statistics", getShopStatistics);

router.get("/categories", getShopCategories);

router.get("/featured", getFeaturedShops);

router.get("/available", getAvailableShops);

router.get("/search", searchShops);

router.get(
  "/layout/:shopType/:wing/:block",
  getShopsByLayout
);
// router.get(
//   "/layout/:shopType/:wing/:block",
//   (req, res) => {
//     console.log("LAYOUT ROUTE HIT");
//     res.json({
//       success: true,
//       params: req.params,
//     });
//   }
// );
router.get(
  "/navigation/:shopType/:wing/:block",
  getNavigation
);

router.get("/code/:shopCode", getShopByCode);

router.get("/category/:type", getShopsByCategory);
router.put("/bulk-update-prices", bulkUpdatePrices);

router.get("/:id", getShopById);


// UPDATE
router.put("/:id", updateShop);


// DELETE
router.delete("/:id", deleteShop);


module.exports = router;