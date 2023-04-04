import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    floor: { type: String, required: true },
    location: { type: String, required: true },
    qr: { type: String },
    services: [
      {
        service: {
          type: mongoose.Types.ObjectId,
          ref: "Admin",
          required: true,
        },
        count: { type: String },
      },
    ],
    shipTo: {
      type: mongoose.Types.ObjectId,
      ref: "ShipTo",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Location", LocationSchema);
