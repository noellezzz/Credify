import express from "express";
import {
  register,
  login,
  schoolRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/school-register", schoolRegister);

router.post("/login", login);

export default router;
