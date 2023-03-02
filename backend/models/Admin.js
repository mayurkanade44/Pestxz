import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    options: [String],
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
