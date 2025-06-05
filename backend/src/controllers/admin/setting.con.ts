import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { createOrUpdateSettingStatus } from "../../services/setting.service";

interface CustomId extends Request {
  user?: any;
}

export const Maintenance = [
  // ✅ Validate the correct field name
  body("mode", "Mode must be a boolean value")
    .exists()
    .custom((value) => value === true || value === false),

  async (req: CustomId, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    const user = req.user;
    const { mode } = req.body;

    const value = mode ? "true" : "false";
    const message = mode
      ? "Set maintenance mode ON"
      : "Set maintenance mode OFF";

    try {
      await createOrUpdateSettingStatus("maintenance", value);
      res.status(200).json({ message });
    } catch (err) {
      next(err);
    }
  },
];
