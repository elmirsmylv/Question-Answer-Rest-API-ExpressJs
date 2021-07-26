import express from "express";
import {
  getAccessToRoute,
  getAnswerOwnerAccess,
} from "../middlewares/Authorization/auth.js";
import { checkAnswerAndQuestionExist } from "../middlewares/database/databaseErrors.js";
import {
  addNewAnswerToQuestion,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeOrUnlikeAnswer,
} from "../controllers/answer.js";

const router = express.Router({ mergeParams: true });

router.post("/add", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswersByQuestion);
router.get("/:answer_id", checkAnswerAndQuestionExist, getSingleAnswer);
router.put(
  "/:answer_id/edit",
  [getAccessToRoute, checkAnswerAndQuestionExist, getAnswerOwnerAccess],
  editAnswer
);
router.delete(
  "/:answer_id/delete",
  [getAccessToRoute, checkAnswerAndQuestionExist, getAnswerOwnerAccess],
  deleteAnswer
);
router.get(
  "/:answer_id/likeOrUnlike",
  [getAccessToRoute, checkAnswerAndQuestionExist],
  likeOrUnlikeAnswer
);

export default router;
