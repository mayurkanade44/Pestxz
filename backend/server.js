import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";




const app = express();
dotenv.config();
mongoose.set("strictQuery", false);


if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


app.use(express.json())













const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, console.log("server is listing"));
  } catch (error) {
    console.log(error);
  }
};

start()
