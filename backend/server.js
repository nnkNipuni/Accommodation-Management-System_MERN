import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";
import advertisementRoutes from "./src/routes/advertisement.route.js";
import userRoutes from "./src/routes/userRoutes.js";

// Load environment variables from a .env file
dotenv.config();
// Initialize Express application
const app   = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Base route
app.get("/Accmmodation_System", (req, res) => {
    res.send("server is ready");
});

// API Routes
app.use("/api/advertisements", advertisementRoutes);
//API user routes
app.use("/api/users", userRoutes);

console.log(process.env.MONGO_URI);

app.listen(5001, () => {
    connectDB();
    console.log("Server started on http://localhost:5001");
});

