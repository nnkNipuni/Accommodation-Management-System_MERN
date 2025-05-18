import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";
import advertisementRoutes from "../backend/src/routes/ad management/advertisement.route.js";
import reviewRoutes from "../backend/src/routes/ad management/review.routes.js";
import PaymentRoutes from "../backend/src/routes/finance/payment.route.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"], // allow only React running on 3000
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Static File Serving
app.use('/uploads', express.static('uploads'));
app.use('/uploads2', express.static('uploads2'));


//  API Routes
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", PaymentRoutes);

//  Health Check
app.get("/Accmmodation_System", (req, res) => {
  res.send("server is ready");
});


app.listen(5001, '0.0.0.0', () => {
    connectDB();
    console.log("Server started on http://localhost:5001");
});
