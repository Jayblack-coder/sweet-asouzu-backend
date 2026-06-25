const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require(
  "../utils/generateToken"
);
const registerAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
    } = req.body;

    const exists = await Admin.findOne({
      email,
    });

    if (exists) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const loginAdmin = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    admin.lastLogin = new Date();

    await admin.save();

    res.status(200).json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  registerAdmin,
  loginAdmin,
};