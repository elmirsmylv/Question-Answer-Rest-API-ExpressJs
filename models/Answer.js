import mongoose from "mongoose";
import CustomError from "../helpers/error/CustomError.js";
import Question from "./Question.js";

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  content: {
    type: String,
    minlength: [10, "Please provide a content at least 10 character"],
    required: [true, "Content could not be empty"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  question: {
    type: mongoose.Schema.ObjectId,
    ref: "Question",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

AnswerSchema.pre("save", async function (next) {
  if (!this.isModified("user")) return next();

  try {
    const question = await Question.findById(this.question);

    question.answers.push(this._id);
    await question.save();
    next();
  } catch (err) {
    return next(new CustomError(err, 500));
  }
});

export default mongoose.model("Answer", AnswerSchema);
