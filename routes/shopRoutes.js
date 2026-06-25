const express = require("express");

const router = express.Router();

const {
  createShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  getAvailableShops,
  getShopsByCategory,
  searchShops,
} = require("../controllers/shopController");

router.post("/", createShop);

router.get("/", getShops);

router.get("/available", getAvailableShops);

router.get(
  "/category/:type",
  getShopsByCategory
);

router.get(
  "/search",
  searchShops
);

router.get("/:id", getShopById);

router.put("/:id", updateShop);

router.delete("/:id", deleteShop);

module.exports = router;