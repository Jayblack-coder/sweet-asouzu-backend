function generateReservationCode() {
  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `SAP-RSV-${random}`;
}

module.exports = generateReservationCode;