import express from "express";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import customerRoute from "./customer.route";

const router = express.Router();
router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/customer", customerRoute);

export default router;
