import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    name: { type: String, required: true },
    level: { type: String, required: true }, // Beginner, Intermediate, Expert
    category: { type: String, required: true }, // Frontend, Backend, etc.
  },
  { timestamps: true }
);

export const Skills = mongoose.model("Skills", skillsSchema);
