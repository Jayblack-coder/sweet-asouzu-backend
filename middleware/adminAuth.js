const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "This admin account has been disabled.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};

module.exports = {
  protectAdmin,
};