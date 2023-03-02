import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Location", LocationSchema);
