const Counter = require("../models/Counter");

const generateReservationNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "reservationCounter",
    {
      $inc: { sequenceValue: 1 },
    },
    {
      new: true,
      upsert: true,
    }
  );

  const year = new Date().getFullYear();

  const sequence = counter.sequenceValue
    .toString()
    .padStart(6, "0");

  return `SAP-RSV-${year}-${sequence}`;
};

module.exports = generateReservationNumber;