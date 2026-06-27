require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Shop = require("../models/Shop");
// const Shop = require("../models/Shop");

console.log(Shop.schema.paths);
connectDB();

const wings = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
];

const blocks = [1, 2, 3, 4, 5, 6];

const rows = [
  {
    name: "Front",
    code: "F",
  },
  {
    name: "Back",
    code: "B",
  },
];

// Adjust these if needed later
const shopConfig = {
  Standard: {
    length: 10,
    width: 10,
    price: 1000000,
    installmentPrice: 1200000,
  },

  Premium: {
    length: 12,
    width: 10,
    price: 0, // update when confirmed
   installmentPrice: 0,
  },

  Executive: {
    length: 15,
    width: 12,
    price: 0, // update when confirmed
   installmentPrice: 0,
  },
};

// Decide shop type by block
function getShopType(block) {
  if (block <= 2) return "Standard";
  if (block <= 4) return "Premium";
  return "Executive";
}

async function seedShops() {
  try {

    console.log("Deleting existing shops...");

    await Shop.deleteMany();

    const shops = [];

    for (const wing of wings) {

      for (const block of blocks) {

        const shopType = getShopType(block);

        const config = shopConfig[shopType];

        for (const row of rows) {

          for (let shopNumber = 1; shopNumber <= 10; shopNumber++) {

            const shopCode =
              `SAP-${wing}${block}-${row.code}${String(shopNumber).padStart(2, "0")}`;

          shops.push({
  shopCode,

  location: {
    wing,
    block,
    row: row.name,
    shopNumber,
  },

  shopType,

  length: config.length,
  width: config.width,
  area: config.length * config.width,

  price: config.price,
  installmentPrice: config.installmentPrice,

  status: "Available",

  description: "",
  images: [],
  videos: [],
  features: [],
  featured: false,
});
          }
        }
      }
    }

    await Shop.insertMany(shops);

    console.log("================================");

    console.log(`Successfully created ${shops.length} shops`);

    console.log("================================");

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }
}

seedShops();