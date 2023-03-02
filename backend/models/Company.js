import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    gst: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
