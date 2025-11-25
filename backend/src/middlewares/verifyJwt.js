import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next(new ApiError(401, "Not authenticated"));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (error) {
    console.log("JWT verify error:", error);
    return next(new ApiError(401, "Invalid token"));
  }
};
