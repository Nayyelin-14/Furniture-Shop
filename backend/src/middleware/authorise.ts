import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorCode } from "../../config/errorCode";
import { generateNewToken } from "../utils/generateNewToken";
import { getUserById } from "../services/auth.services";
import { checkUserIfNotExist } from "../utils/auth.utils";
import { handleError } from "../utils/handleError";
interface CustomId extends Request {
  userId?: number;
  user?: any;
}
export const authroiseMiddleware = (
  permission: boolean,
  ...roles: string[]
) => {
  return async (req: CustomId, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const roleResult = roles.includes(user!.role);
    if ((permission && !roleResult) || (!permission && roleResult)) {
      return next(
        handleError("Unauthorized User", 401, errorCode.unauthorized)
      );
    }
    req.user = user;
    next();
  };
};
