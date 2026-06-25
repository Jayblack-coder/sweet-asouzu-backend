const { randomUUID } = require("crypto");

function generatePaymentCode() {
  return `SAP-PAY-${randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;
}

module.exports = generatePaymentCode;