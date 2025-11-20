import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    title: { type: String, required: true },
    issuer: { type: String,required: true },
    issueDate: { type: Date,required: true },
    certificateLink: { type: String },
    image: { type: String,required: true },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);
