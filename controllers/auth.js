import CustomError from "../helpers/error/CustomError.js";
import {
  comparePasswords,
  validateUserinputs,
} from "../helpers/input/inputHelpers.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const token = user.generateJwtFromUser();

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(
          Date.now() + parseInt(process.env.JWT_COOKIE) * 1000 * 60
        ),
        secure: process.env.NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        access_token: token,
        data: {
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    return next(new CustomError(error.message, 400));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!validateUserinputs(email, password)) {
      return next(new CustomError("Email or password is empty", 401));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!comparePasswords(password, user.password)) {
      return next(new CustomError("Please check your credantials!", 400));
    }

    const token = user.generateJwtFromUser();

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expiresIn: new Date(
          Date.now() + parseInt(process.env.JWT_COOKIE * 1000 * 60)
        ),
        secure: process.env.NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        access_token: token,
        date: {
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    return next(new CustomError(error.message, 401));
  }
};

export const logout = async (req, res, next) => {
  return res
    .status(200)
    .cookie("access_token", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
};

export const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};
