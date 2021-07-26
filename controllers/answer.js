import CustomError from "../helpers/error/CustomError.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

export const addNewAnswerToQuestion = async (req, res, next) => {
  try {
    const { question_id } = req.params;
    const userId = req.user.id;

    const answerInfos = req.body;

    const answer = await Answer.create({
      ...answerInfos,
      user: userId,
      question: question_id,
    });

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    return next(new CustomError(error.message, 400));
  }
};

export const getAllAnswersByQuestion = async (req, res, next) => {
  try {
    const { question_id } = req.params;

    const questions = await Question.findById(question_id).populate("answers");

    const answers = questions.answers;

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
  } catch (err) {
    return next(new CustomError(err.message, 400));
  }
};

export const getSingleAnswer = async (req, res, next) => {
  try {
    const { answer_id } = req.params;

    const answer = await Answer.findById(answer_id)
      .populate({
        path: "question",
        select: "title",
      })
      .populate({
        path: "user",
        select: "name profile_image email",
      });

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const editAnswer = async (req, res, next) => {
  try {
    const { answer_id } = req.params;
    const { content } = req.body;

    const answer = await Answer.findById(answer_id);

    answer.content = content;

    await answer.save();

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    return next(new CustomError("Editing failed", 500));
  }
};

export const deleteAnswer = async (req, res, next) => {
  try {
    const { answer_id } = req.params;
    const { question_id } = req.params;

    const answer = await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);

    //Answer deleted from question too
    question.answers.splice(question.answers.indexOf(answer_id, 1));

    await question.save();

    res.status(200).json({
      success: true,
      message: "Answer deleted",
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const likeOrUnlikeAnswer = async (req, res, next) => {
  try {
    const { answer_id } = req.params;

    const answer = await Answer.findById(answer_id);

    if (answer.likes.includes(req.user.id)) {
      answer.likes.splice(answer.likes.indexOf(req.user.id), 1);
    } else {
      answer.likes.push(req.user.id);
    }

    await answer.save();

    res.status(200).json({
      success: true,
      message: "Answer liked",
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
