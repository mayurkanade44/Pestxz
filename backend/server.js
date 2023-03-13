import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";

import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js";
import shipToRouter from "./routes/shipToRoute.js";
import adminRouter from "./routes/adminRoute.js";
import locationRouter from "./routes/locationRoute.js";
import reportRouter from "./routes/reportRoute.js";
import { authenticateUser } from "./middleware/auth.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/shipTo", authenticateUser, shipToRouter);
app.use("/api/admin", authenticateUser, adminRouter);
app.use("/api/location", authenticateUser, locationRouter);
app.use("/api/report", authenticateUser, reportRouter);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, console.log("server is listing"));
  } catch (error) {
    console.log(error);
  }
};

start();
