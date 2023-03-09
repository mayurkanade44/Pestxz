import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js";
import shipToRouter from "./routes/shipToRoute.js";
import adminRouter from "./routes/adminRoute.js";
import locationRouter from "./routes/locationRoute.js";
import reportRouter from "./routes/reportRoute.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/shipTo", shipToRouter);
app.use("/api/admin", adminRouter);
app.use("/api/location", locationRouter);
app.use("/api/report", reportRouter);

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
