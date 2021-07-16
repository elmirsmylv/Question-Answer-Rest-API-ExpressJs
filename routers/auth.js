import express from "express";
import { register, getUser, login, logout } from "../controllers/auth.js";
import { getAccessToRoute } from "../middlewares/Authorization/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUser", getAccessToRoute, getUser);
router.get("/logout", getAccessToRoute, logout);

export default router;
