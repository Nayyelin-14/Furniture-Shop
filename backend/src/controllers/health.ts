export interface CUstomId extends Request {
  userID?: number;
}
import express, { Request, Response } from "express";
export const Health = (req: CUstomId, res: Response) => {
  return res.json({ message: "I got the userasdfasdf", userid: req.userID });
};
