import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if (!token) throw new ApiError(401, "No token provided");
   
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SCERET);

    const user = await User.findById(decoded?._id).select("-password -refreshTokens");

    if (!user) throw new ApiError(401, "User not found");

    req.user = user; 
    next();

  } catch (error) {
    next(error);
  }
};