import jwt from "jsonwebtoken";
import { errorCode } from "../../config/errorCode";
import { CookieOptions, NextFunction, Response, Request } from "express";
import { getUserByPhone, updateUser } from "../services/auth.services";
import { checkUserIfNotExist } from "./auth.utils";
import { handleError } from "./handleError";

interface CustomId extends Request {
  userId?: number;
}
export const generateNewToken = async (
  oldRefreshToken: string,
  req: CustomId,
  res: Response,
  next: NextFunction
) => {
  let decoded;
  try {
    decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as {
      id: number;
      phone: string;
    };
  } catch (err: any) {
    return next(
      handleError("Not an authenticated user", 400, errorCode.unthenticated)
    );
  }

  if (isNaN(decoded!.id)) {
    return next(
      handleError("Not an authenticated user", 400, errorCode.unthenticated)
    );
  }
  const user = await getUserByPhone(decoded!.phone);
  checkUserIfNotExist(user);

  const isInvalidUser =
    user?.phone !== decoded?.phone || oldRefreshToken !== user?.randomToken;

  if (isInvalidUser) {
    return next(
      handleError("Not an authenticated user", 400, errorCode.unthenticated)
    );
  }
  //if all ok , create new token
  const accessTokenPayload = { id: user!.id };
  const refreshTokenPayload = { id: user!.id, phone: user!.phone };

  const generateNewAccessToken = jwt.sign(
    accessTokenPayload,
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: 60 * 15 }
  );

  const generateNewRefreshToken = jwt.sign(
    refreshTokenPayload,
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "30d" }
  );
  const updateUserData = {
    randomToken: generateNewRefreshToken,
  };
  await updateUser(updateUserData, user!.id);

  const option: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };
  res
    .cookie("accessToken", generateNewAccessToken, {
      ...option,
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", generateNewRefreshToken, {
      ...option,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

  req.userId = user.id;

  next();
};
