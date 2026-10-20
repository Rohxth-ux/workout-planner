import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import authRoute from "./routes/auth.js";
import mealRoute from "./routes/meals.js";
import routineRoute from "./routes/routines.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/meals", mealRoute);
app.use("/api/routines", routineRoute);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({ success: false, status, message });
});

app.listen(2000, () => console.log("Server running on port 2000"));