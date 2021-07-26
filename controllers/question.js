import CustomError from "../helpers/error/CustomError.js";
import Question from "../models/Question.js";

export const askNewQuestion = async (req, res, next) => {
  try {
    const informations = req.body;

    const question = await Question.create({
      ...informations,
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const getSingleQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const editQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, content } = req.body;

    const question = await Question.findById(id);

    if (title) {
      question.title = title;
    }

    if (content) {
      question.content = content;
    }

    const updatedQuestion = await question.save();

    res.status(200).json({
      success: true,
      data: updatedQuestion,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Question.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Question deleted",
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const likeOrUnlikeQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (question.likes.includes(req.user.id)) {
      const index = question.likes.indexOf(req.user.id);

      question.likes.splice(index, 1);
    } else {
      question.likes.push(req.user.id);
    }

    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    return next(new CustomError(error.message, 400));
  }
};
