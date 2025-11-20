import mongoose from "mongoose";

const hobbiesSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    hobby: { type: String, required: true },
  },
  { timestamps: true }
);

export const Hobbies = mongoose.model("Hobbies", hobbiesSchema);
