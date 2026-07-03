exports.formatShopForBuyer = (shop) => {
  const shopObj = shop.toObject ? shop.toObject() : shop;

  let displayStatus = "Available";

  switch (shopObj.status) {
    case "Completed":
    case "Sold":
      displayStatus = "Sold";
      break;

    case "Reserved":
    case "Payment Pending":
      displayStatus = "Reserved";
      break;

    default:
      displayStatus = "Available";
  }

  return {
    ...shopObj,
    status: displayStatus,
  };
};