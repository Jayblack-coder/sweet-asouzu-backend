const Buyer = require("../models/Buyer");
const generateToken = require("../utils/generateToken");

const registerBuyer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      state,
      country,
    } = req.body;

    const exists =
      await Buyer.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "This Email already exists",
      });
    }

    const buyer =
      await Buyer.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        address,
        state,
        country,
        role: "buyer"
      });

    res.status(201).json({
      success: true,
      buyer,
      token: generateToken(
        buyer._id
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginBuyer = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    // const buyer =
    //   await Buyer.findOne({
    //     email,
    //   });
    const buyer = await Buyer.findOne({
  email,
  isActive: true,
});

    if (
      buyer &&
      (await buyer.matchPassword(
        password
      ))
    ) {
      return res.json({
        success: true,
        buyer,
        token:
          generateToken(
            buyer._id
          ),
      });
    }

    res.status(401).json({
      success: false,
      message:
        "Invalid email or password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBuyerProfile = async (
  req,
  res
) => {
  try {
    const buyer =
      await Buyer.findById(
        req.buyer._id
      ).select("-password");

    res.json({
      success: true,
      buyer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyer.findById(
      req.params.id
    );

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    res.status(200).json({
      success: true,
      buyer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBuyerProfile =
  async (req, res) => {
    try {
      const buyer =
        await Buyer.findById(
          req.buyer._id
        );

      if (!buyer) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Buyer not found",
          });
      }

      buyer.firstName =
        req.body.firstName ??
        buyer.firstName;

      buyer.lastName =
        req.body.lastName ??
        buyer.lastName;

      buyer.phone =
        req.body.phone ??
        buyer.phone;

      buyer.address =
        req.body.address ??
        buyer.address;

      buyer.state =
        req.body.state ??
        buyer.state;

      buyer.country =
        req.body.country ??
        buyer.country;

      if (req.body.password) {
        buyer.password =
          req.body.password;
      }

      await buyer.save();

      res.json({
        success: true,
        buyer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const deleteBuyerProfile = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.buyer._id);

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found",
      });
    }

    buyer.isActive = false;

    await buyer.save();

    res.status(200).json({
      success: true,
      message: "Buyer account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerBuyer,
  loginBuyer,
  getBuyerProfile,
  updateBuyerProfile,
  deleteBuyerProfile
};