import express, { Router } from "express";
import {
  confirmPassword,
  login,
  logout,
  register,
  veridyOtp,
} from "../controllers/auth/auth.con";
import {
  changeNewPassword,
  forgetPassword,
  resetPassowrd,
  verifyOtpForPassword,
} from "../controllers/auth/password.con";
import { authMiddleware } from "../middleware/authMiddleware";
import { authcheck } from "../controllers/auth/authCheck";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", veridyOtp);
router.post("/confirm-password", confirmPassword);
router.post("/login", login);
router.post("/logout", logout);
///
router.post("/forget-password", forgetPassword);
router.post("/verify", verifyOtpForPassword);
router.post("/reset-password", resetPassowrd);

//change to new password
router.post("/change-password", authMiddleware, changeNewPassword);

router.get("/auth-check", authMiddleware, authcheck);
export default router;
