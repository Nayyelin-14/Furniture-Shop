import { NextFunction, Request, Response } from "express";
interface CustomId extends Request {
  user?: any;
}
export const getAllusers = (
  req: CustomId,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  res.status(200).json({ message: req.t("welcome"), user });
};
