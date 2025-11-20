import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

// Method to generate the short-lived access token
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
  },
    process.env.ACCESS_TOKEN_SCERET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

// Method to generate the long-lived refresh token
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({
    _id: this._id,

  },
    process.env.REFRESH_TOKEN_SCERET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema);

