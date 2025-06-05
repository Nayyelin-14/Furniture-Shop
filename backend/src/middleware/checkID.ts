import { Request, Response, NextFunction } from "express";

export interface CUstomId extends Request {
  userID?: number;
}
export const check = (req: CUstomId, res: Response, next: NextFunction) => {
  req.userID = 212123;
  next();
};
