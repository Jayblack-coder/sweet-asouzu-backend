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