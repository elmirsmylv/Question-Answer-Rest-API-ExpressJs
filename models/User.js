import mongoose from "mongoose";
import bcrypt from "bcrypt";
import CustomError from "../helpers/error/CustomError.js";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is empty"],
  },
  email: {
    type: String,
    required: [true, "Email field is empty"],
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Email is not valid"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password field is empty"],
    select: false,
    minlength: [6, "Password cannot be less than 6 characters"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  createdAt: {
    type: Date,
    defult: Date.now(),
  },
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  place: {
    type: String,
  },
  website: {
    type: String,
  },
  profile_image: {
    type: String,
    default: "default.jpg",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

//User methods
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });

  return token;
};

UserSchema.pre("save", function (next) {
  // Password recovery
  if (!this.isModified("password")) {
    next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(new CustomError(err.message, 400));

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(new CustomError(err.message, 400));

      this.password = hash;
      next();
    });
  });
});

export default mongoose.model("User", UserSchema);
