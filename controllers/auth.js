import CustomError from "../helpers/error/CustomError.js";
import {
  comparePasswords,
  validateUserinputs,
} from "../helpers/input/inputHelpers.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendMail } from "../helpers/libraries/sendEmail.js";
import { emailTemplate } from "../helpers/authorization/emailTemplate.js";

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
      return next(new CustomError("Wrong password!", 400));
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
        data: {
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    return next(new CustomError("Login Unsuccessfull", 401));
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

export const forgotPassword = async (req, res, next) => {
  try {
    const resetEmail = req.body.email;
    //console.log(resetEmail);

    const user = await User.findOne({ email: resetEmail }).select("+password");

    if (!user) {
      return next(new CustomError("User is not defined", 400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `${process.env.ENDPOINT_URL}/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplateForMail = emailTemplate(resetPasswordUrl);

    // `
    //   <h3>Reset your password</h3>
    //   <p><a href="${resetPasswordUrl}">Please click this link for reset your password</a> Link will expire in 1 hour</p>
    // `

    try {
      await sendMail({
        from: process.env.SMTP_USER,
        to: resetEmail,
        subject: "Reset your password",
        html: emailTemplateForMail,
      });
      return res.status(200).json({
        success: true,
        message: "Token sent to mail",
      });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordTokenExpire = null;

      await user.save();

      return next(new CustomError(error.message, 500));
    }
  } catch (error) {
    return next(new CustomError(error.message, 404));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    if (!resetPasswordToken) {
      return next(new CustomError("Please provide a valid token", 400));
    }

    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new CustomError(err.message, 404));
    }

    // TODO: row 168 and 169 not working
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;
    user.password = password;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Password successfully reset",
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

export const editDetails = async (req, res, next) => {
  try {
    const editInformations = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, editInformations, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new CustomError("Editing failed", 500));
  }
};
