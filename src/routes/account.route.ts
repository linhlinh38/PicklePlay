import express from "express";

import accountController from "../controllers/account.controller";
import validate from "../utils/validate";
import { createAccountSchema } from "../models/validateSchema/createAccount.validate.schema";

const router = express.Router();
router.get("/", accountController.getAllAccount);
router.post(
  "/create",
  validate(createAccountSchema),
  accountController.createAccount
);

export default router;
