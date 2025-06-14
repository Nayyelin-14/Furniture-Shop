import { NextFunction, Request, Response } from "express";
import { getUserById } from "../../services/auth.services";
import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/auth.utils";
interface CustomUserReq extends Request {
  userId?: number;
}
export const authcheck = async (
  req: CustomUserReq,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  if (!userId) {
    const error: any = new Error("Unauthenticated User");
    error.status = 400;
    error.code = errorCode.unthenticated;
    return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
  }
  const user = await getUserById(userId!);
  await checkUserIfNotExist(user);

  res.status(200).json({ message: "Authenticated user", user: user?.id });
};
