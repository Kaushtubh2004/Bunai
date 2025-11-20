import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", required: true
    },
    title: {
      type: String,
      required: true
    },
    tagline: {
      type: String
    },
    theme: {
      type: String,
    },
    username: {
      type: String,
    },
    userDetails: {
      type: Boolean,
      default: false
    }


  },
  { timestamps: true }
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
