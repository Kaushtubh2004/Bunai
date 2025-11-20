import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String },
  },
  { timestamps: true }
);

export const SocialLinks = mongoose.model("SocialLinks", socialLinksSchema);
