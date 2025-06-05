import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorCode } from "../../config/errorCode";
import { generateNewToken } from "../utils/generateNewToken";
import { handleError } from "../utils/handleError";
interface CustomId extends Request {
  userId?: number;
}
export const authMiddleware = (
  req: CustomId,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  if (!refreshToken) {
    return next(
      handleError(
        "Unauthenticated user.Try Again!!!",
        401,
        errorCode.unthenticated
      )
    );
  }

  if (!accessToken) {
    generateNewToken(refreshToken, req, res, next);
  } else {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
      };
      if (isNaN(decoded!.id)) {
        return next(
          handleError(
            "Unauthenticated user.Try Again!!!",
            401,
            errorCode.unthenticated
          )
        );
      }
      req.userId = decoded!.id;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        generateNewToken(refreshToken, req, res, next);
      } else {
        return next(handleError("Token is invalid", 400, errorCode.invalid));
      }
    }
  }
};
