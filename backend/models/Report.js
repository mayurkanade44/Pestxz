import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reportData: [Object],
    subLocation: {
      type: mongoose.Types.ObjectId,
      ref: "SubLocation",
      required: true,
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);
