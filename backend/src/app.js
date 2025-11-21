import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session"; 
import "./utils/passport.js";

const app = express();

app.use(
  cors({
    origin :process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => res.send("Server running"));


import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export { app };
