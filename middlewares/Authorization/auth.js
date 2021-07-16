import jwt from "jsonwebtoken";
import {
  getTokenFromHeader,
  isTokenIncluded,
} from "../../helpers/authorization/tokenHelpers.js";
import CustomError from "../../helpers/error/CustomError.js";

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
