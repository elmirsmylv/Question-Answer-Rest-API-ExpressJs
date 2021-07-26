import express from "express";
import {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeOrUnlikeQuestion,
} from "../controllers/question.js";
import {
  getAccessToRoute,
  getQuestionOwnerAccess,
} from "../middlewares/Authorization/auth.js";
import { checkQuestionExist } from "../middlewares/database/databaseErrors.js";
import answer from "./answer.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:id", checkQuestionExist, getSingleQuestion);
router.get(
  "/:id/likeOrUnlike",
  [getAccessToRoute, checkQuestionExist],
  likeOrUnlikeQuestion
);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/:id/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);

//Answer route configuration
router.use("/:question_id/answers", checkQuestionExist, answer);

export default router;
