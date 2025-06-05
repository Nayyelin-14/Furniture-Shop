import { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { errorCode } from "../../config/errorCode";
import { handleError } from "../utils/handleError";

export const chnageLanguage = [
  query("lng", "Invalid Language code")
    .trim()
    .notEmpty()
    .matches(/^[a-z]+$/)
    .isLength({ min: 2, max: 3 })
    .withMessage(errorCode.invalid),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    const { lng } = req.query;
    res
      .cookie("i18next", lng)
      .status(200)
      .json({ message: req.t("changeLang", { lang: lng }) });
  },
];
