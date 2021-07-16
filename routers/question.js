import express from "express";
import { getAllQuestions } from "../controllers/question.js";

const router = express.Router();

router.get("/", getAllQuestions);

export default router;
