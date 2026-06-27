const jwt = require("jsonwebtoken");
const Buyer = require("../models/Buyer");

const protectBuyer = async (
  req,
  res,
  next
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    if (!token) {
      return res.status(401).json({
        message:
          "Not authorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
console.log("Decoded JWT:", decoded);
    req.buyer =
      await Buyer.findById(
        decoded.id
      ).select("-password");
console.log("Buyer from DB:", req.buyer);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = protectBuyer;