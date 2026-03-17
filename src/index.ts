import express from "express";
import cors from "cors";
import auth_route from "./modules/auth/auth.route";
import { FRONTEND_URL, NODE_ENV, PORT } from "./modules/constants/env";
import connectToDB from "./modules/config/db";
import errorHandler from "./modules/middleware/errorHandler";
import cookieParser from "cookie-parser";
import task_route from "./modules/task/task.route";
import passport from "passport";
import "./modules/config/passport";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(passport.initialize());

//Routes
app.use("/auth", auth_route);
app.use("/task",task_route);

app.use(errorHandler)

app.listen(PORT, async () => {
  connectToDB();
  console.log("✅ MongoDB connected");
  console.log(`✅ Server running on port ${PORT}`);
  console.log("✅ we are on ", NODE_ENV);
});
