import express from "express";
import question from "./question.js";
import auth from "./auth.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/questions", question);

export default router;
