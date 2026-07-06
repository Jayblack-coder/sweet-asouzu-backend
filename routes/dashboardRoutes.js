const express = require("express");
const router = express.Router();

const {
  getDashboard,
} = require("../controllers/dashboardController");

const {
  protectAdmin,
} = require("../middleware/adminAuth");

router.get(
  "/overview",
  protectAdmin,
  getDashboard
);

module.exports = router;