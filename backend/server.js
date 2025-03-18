import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";
dotenv.config();

const app   = express();

app.get("/Acc_System", (req, res) => {
    res.send("server is ready");
});

console.log(process.env.MONGO_URI);

app.listen(5001, () => {
    connectDB();
    console.log("Server started on http://localhost:5001");
});

