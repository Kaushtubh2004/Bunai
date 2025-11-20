import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    fullName: { type: String, required: true },
    role: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    profileImage: { type: String },
    about: {type: String},
    resumeLink: { type: String },
  },
  { timestamps: true }
);

export const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
