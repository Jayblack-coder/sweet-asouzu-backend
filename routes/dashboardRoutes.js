const express = require("express");
const router = express.Router();

const {
  getDashboard,
} = require("../controllers/dashboardController");

router.get("/overview", getDashboard);

module.exports = router;