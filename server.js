require("dotenv").config();
// console.log(process.env.MONGO_URI);
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const reservationRoutes = require("./routes/reservationRoutes");
const app = express();
// const adminRoutes =
//   require("./routes/adminRoutes");
 connectDB();
const buyerRoutes = require("./routes/buyerRoutes");
const shopRoutes =
require("./routes/shopRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://oba-shoppingcomplex.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
// app.use("/api/admin", adminRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/buyers", buyerRoutes);
app.use(
  "/api/shops",
  shopRoutes
);
// app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  res.send("Sweet Asouzu Plaza API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});