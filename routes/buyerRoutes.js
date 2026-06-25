const express = require("express");

const router = express.Router();

const {
  createBuyer,
  getBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
} = require("../controllers/buyerController");

router.post("/", createBuyer);

router.get("/", getBuyers);

router.get("/:id", getBuyerById);

router.put("/:id", updateBuyer);

router.delete("/:id", deleteBuyer);

module.exports = router;