import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return next(new ApiError(401, "Not authenticated"));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid token"));
  }
};
