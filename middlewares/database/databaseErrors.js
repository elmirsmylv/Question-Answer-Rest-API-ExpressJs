import CustomError from "../../helpers/error/CustomError.js";
import User from "../../models/User.js";
import Question from "../../models/Question.js";
import Answer from "../../models/Answer.js";

export const checkUserExist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = User.findById(id);

    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    next();
  } catch (error) {
    return next(new CustomError("User checking failed", 500));
  }
};
export const checkQuestionExist = async (req, res, next) => {
  try {
    const question_id = req.params.id || req.params.question_id;

    const question = Question.findById(question_id);

    if (!question) {
      return next(new CustomError("Question not found", 404));
    }
    next();
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const checkAnswerAndQuestionExist = async (req, res, next) => {
  try {
    const { answer_id } = req.params;
    const { question_id } = req.params;

    const answer = await Answer.findOne({
      _id: answer_id,
      question: question_id,
    });

    if (!answer) {
      return next(new CustomError("There is not such a answer", 404));
    }
    next();
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
