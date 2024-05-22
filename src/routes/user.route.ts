import express from "express";

import userController from "../controllers/user.controller";
import validate from "../utils/validate";
import { createUserSchema } from "../models/validateSchema/createUser.validate.schema";
import authController from "../controllers/auth.controller";

const router = express.Router();
router.get("/", userController.getAllUsers);
router.post("/create", validate(createUserSchema), userController.createUser);
router.post("/login", authController.login);

export default router;
