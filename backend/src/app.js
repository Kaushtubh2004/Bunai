import express from "express";
import cors from "cors";
import passport from "passport"; 
import "./utils/passport.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL 
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(passport.initialize());
app.get("/", (req, res) => res.send("Server running"));


import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export { app };
