import express from "express";
import {
  register,
  getUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  editDetails,
} from "../controllers/auth.js";
import { getAccessToRoute } from "../middlewares/Authorization/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUser", getAccessToRoute, getUser);
router.get("/logout", getAccessToRoute, logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/edit", getAccessToRoute, editDetails);

export default router;
