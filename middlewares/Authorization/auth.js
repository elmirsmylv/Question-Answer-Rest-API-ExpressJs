import jwt from "jsonwebtoken";
import {
  getTokenFromHeader,
  isTokenIncluded,
} from "../../helpers/authorization/tokenHelpers.js";
import CustomError from "../../helpers/error/CustomError.js";
import User from "../../models/User.js";
import Question from "../../models/Question.js";
import Answer from "../../models/Answer.js";

export const getAccessToRoute = (req, res, next) => {
  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("You are not authorized to access this route", 401)
    );
  }

  const token = getTokenFromHeader(req);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("You are not authorized to access this route", 401)
      );
    }

    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
  });

  next();
};

export const getAdminAccess = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (user.role !== "admin") {
      next(new CustomError("You have not access to this route", 403));
    }
    next();
  } catch (error) {
    return next(new CustomError("You have not access to this route", 401));
  }
};

export const getQuestionOwnerAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const question = await Question.findById(id);

    if (question.user != userId) {
      return next(new CustomError("You are not owner this question", 403));
      next();
    }

    next();
  } catch (error) {
    return next(new CustomError("You are not owner this question", 403));
  }
};

export const getAnswerOwnerAccess = async (req, res, next) => {
  try {
    const { answer_id } = req.params;
    const userId = req.user.id;

    const answer = await Answer.findById(answer_id);

    if (answer.user != userId) {
      return next(new CustomError("You are not owner this answer"));
    }
    next();
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
