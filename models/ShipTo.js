import mongoose from "mongoose";

const ShipToSchema = new mongoose.Schema(
  {
    shipToName: { type: String, required: true },
    shipToAddress: { type: String, required: true },
    shipToEmail: { type: String },
    shipToNumber: { type: Number },
    complaints: [
      {
        location: String,
        number: Number,
        image: String,
        pest: String,
        status: String,
        createdAt: Date,
      },
    ],
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShipTo", ShipToSchema);
