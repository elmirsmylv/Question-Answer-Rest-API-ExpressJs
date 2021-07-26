import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title field could not be empty"],
    minlength: [10, "Please provide title at least 10 characters"],
    unique: true,
  },
  content: {
    type: String,
    required: [true, "Content field could not be empty"],
    minlength: [20, "Please provide content at leaset 20 character"],
  },
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  answers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Answer",
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

QuestionSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    next();
  }

  this.slug = this.makeSlug();
  next();
});

QuestionSchema.methods.makeSlug = function () {
  return slugify(this.title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });
};

export default mongoose.model("Question", QuestionSchema);
