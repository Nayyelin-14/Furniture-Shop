import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorCode } from "../../config/errorCode";
import { generateNewToken } from "../utils/generateNewToken";
import { handleError } from "../utils/handleError";
interface CustomId extends Request {
  userId?: number;
}
export const authMiddleware = async (
  req: CustomId,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken || null;
  const refreshToken = req.cookies?.refreshToken || null;

  if (!refreshToken) {
    return next(
      handleError(
        "Unauthenticated user. Try Again!!!",
        401,
        errorCode.unthenticated
      )
    );
  }

  let decoded;

  // Step 1: Try access token
  try {
    if (accessToken) {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
      };
      req.userId = decoded.id;
      return next();
    }
    throw new jwt.TokenExpiredError("AccessToken Missing", new Date());
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      // Step 2: Try to refresh token
      try {
        await generateNewToken(refreshToken, req, res, () => {});
        const newAccessToken = req.cookies?.accessToken;
        if (!newAccessToken) {
          return next(
            handleError("Token refresh failed", 401, errorCode.unthenticated)
          );
        }

        // Step 3: Verify new access token
        decoded = jwt.verify(
          newAccessToken,
          process.env.ACCESS_TOKEN_SECRET!
        ) as { id: number };
        req.userId = decoded.id;
        return next();
      } catch (refreshError) {
        return next(
          handleError("Token refresh failed", 401, errorCode.unthenticated)
        );
      }
    }

    return next(handleError("Token is invalid", 400, errorCode.invalid));
  }
};
