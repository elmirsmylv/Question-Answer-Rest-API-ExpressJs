import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js";

export const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new CustomError("Please provide a valid id", 400));
    }

    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new CustomError(error.message, 404));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return next(new CustomError(error.message, 404));
  }
};
