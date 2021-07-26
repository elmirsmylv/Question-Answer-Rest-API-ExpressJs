import express from "express";
import question from "./question.js";
import auth from "./auth.js";
import user from "./user.js";
import admin from "./admin.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/questions", question);
router.use("/users", user);
router.use("/admin", admin);

export default router;
