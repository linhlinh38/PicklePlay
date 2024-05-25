import express from "express";
import auth from "../middlewares/auth";
import userController from "../controllers/user.controller";
import validate from "../utils/validate";
import { createUserSchema } from "../models/validateSchema/createUser.validate.schema";

const router = express.Router();
router.use(auth);
router.get("/", userController.getAllUsers);
router.post("/create", validate(createUserSchema), userController.createUser);

export default router;
