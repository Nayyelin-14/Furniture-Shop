import { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { errorCode } from "../../config/errorCode";
import { getUserById } from "../services/auth.services";
import { authoriseByRoles, checkUserIfNotExist } from "../utils/auth.utils";
import { handleError } from "../utils/handleError";
interface CustomId extends Request {
  userId?: number;
}
export const authorization = [
  async (req: CustomId, res: Response, next: NextFunction) => {
    const info: any = {
      title: "Testing Permission",
    };
    const userId = req.userId;
    if (!userId) {
      const error: any = new Error("Unauthenticated user");
      error.status = 400;
      error.code = errorCode.unthenticated;
      return next(
        handleError("Unauthenticated user", 400, errorCode.unthenticated)
      ); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    console.log(userId);

    const user = await getUserById(userId);
    await checkUserIfNotExist(user);

    const authorisedAccess = await authoriseByRoles(true, user!.role, "AUTHOR");
    if (authorisedAccess) {
      info.content = "You have got accessed as an author";
    }
    res.status(200).json({ info });
  },
];
