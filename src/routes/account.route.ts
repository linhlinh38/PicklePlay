import express from "express";

import userController from "../controllers/user.controller";
import validate from "../utils/validate";
import { createUserSchema } from "../models/validateSchema/createUser.validate.schema";

const router = express.Router();
router.get("/", userController.getAllUsers);
router.post("/create", validate(createUserSchema), userController.createUser);

export default router;
