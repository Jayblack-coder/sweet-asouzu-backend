const express = require("express");

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
} = require(
  "../controllers/adminController"
);

const { getDashboard } = require("../controllers/dashboardController");
const {
    protectAdmin,
} = require("../middleware/adminAuth");

const authorize = require("../middleware/adminRole");

// router.get(
//     "/dashboard",
//     protectAdmin,
//     authorize(
//         "Super Admin",
//         "Sales Manager"
//     ),
//     getDashboard
// );

// router.get(
//   "/overview",
//   protectAdmin,
//   getDashboard
// );

router.post(
  "/register",
  registerAdmin
);

router.post(
  "/login",
  loginAdmin
);

module.exports = router;