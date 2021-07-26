import CustomError from "../helpers/error/CustomError.js";
import User from "../models/User.js";

export const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    user.blocked = !user.blocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User block/unblock success",
    });
  } catch (error) {
    return next(new CustomError("User block/unblock failed", 404));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    return next(new CustomError("User deleting failed", 500));
  }
};
