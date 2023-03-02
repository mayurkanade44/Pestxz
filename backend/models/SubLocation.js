import mongoose from "mongoose";

const SubLocationSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    services: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true,
      },
    ],
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("SubLocation", SubLocationSchema)