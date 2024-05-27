import express from "express";
import authController from "../controllers/auth.controller";
import auth from "../middlewares/auth";

const authRoute = express.Router();
authRoute.post("/login", authController.login);
authRoute.use(auth);
authRoute.post("/refresh", authController.refreshToken);
authRoute.get("/me", authController.getProfile);
export default authRoute;
