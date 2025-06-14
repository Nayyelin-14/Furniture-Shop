import { body, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { NextFunction, Response, Request, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import {
  createNewUser,
  getOtpByPhone,
  getUserByPhone,
  updateOtp,
  updateUser,
} from "../../services/auth.services";
import {
  checkOtpErrorInOneDay,
  checkOtpExist,
  checkUserIfNotExist,
} from "../../utils/auth.utils";
import { generateOTP, generateToken } from "../../utils/generateOtp";
import bcrypt from "bcrypt";
import moment from "moment";
import { handleError } from "../../utils/handleError";

export const forgetPassword = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Invalid Phone Number"),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    await checkUserIfNotExist(user);

    const otp = "123456"; //for testing
    //     const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const token = generateToken();

    const otpResult = await getOtpByPhone(phone);
    await checkOtpExist(otpResult);

    let result;
    const latestOtpDate = new Date(otpResult!.updatedAt).toLocaleDateString();
    const currentDate = new Date().toLocaleDateString();
    const isSameDate = latestOtpDate === currentDate;
    await checkOtpErrorInOneDay(isSameDate, otpResult!.error);
    if (!isSameDate) {
      const optData = {
        optCode: hashedOtp,
        rememberToken: token,
        count: 1,
        error: 0,
      };
      result = await updateOtp(optData, otpResult!.id);
    } else {
      if (otpResult!.count === 3) {
        const error: any = new Error("You have requested over limit");
        error.status = 400;
        error.code = errorCode.overLimit;

        return next(
          handleError("You have requested over limit", 400, errorCode.overLimit)
        );
      } else {
        const optData = {
          optCode: hashedOtp,
          rememberToken: token,
          count: { increment: 1 },
        };
        result = await updateOtp(optData, otpResult!.id);
      }
    }
    res.status(200).json({
      message: `We have sent Otp to 09${result?.phone} to reset password`,
      phone: result!.phone,
      token: result!.rememberToken,
    });
  },
];

export const verifyOtpForPassword = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Invalid Phone Number"),
  body("otp", "Invalid OTP")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 6, max: 6 }),
  body("token", "Invalid token").trim().notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }
    const { otp, token } = req.body;
    // const user = await getUserByPhone(phone);
    // await checkUserIfNotExist(user);

    const otpResult = await getOtpByPhone(phone);
    await checkOtpExist(otpResult);

    const latestOtpDate = new Date(otpResult!.updatedAt).toLocaleDateString();
    const currentDate = new Date().toLocaleDateString();
    const isSameDate = latestOtpDate === currentDate;
    await checkOtpErrorInOneDay(isSameDate, otpResult!.error);

    if (otpResult!.rememberToken !== token) {
      const optData = {
        error: 5,
      };
      await updateOtp(optData, otpResult!.id);
      const error: any = new Error("Invalid Token");
      error.status = 400;
      error.code = errorCode.invalid;
      return next(handleError("Invalid Token", 400, errorCode.invalid));
    }

    //otp expired
    const isOtpExpired = moment().diff(otpResult!.updatedAt, "minutes") > 2;
    if (isOtpExpired) {
      const error: any = new Error("Otp is Expired");
      error.status = 400;
      error.code = errorCode.otpExpired;
      return next(handleError("Otp is Expired", 400, errorCode.otpExpired));
    }

    ///compare otp
    const isOtpMatch = await bcrypt.compare(otp, otpResult!.optCode);
    if (!isOtpMatch) {
      const otpData = !isSameDate ? { error: 1 } : { error: { increment: 1 } };

      await updateOtp(otpData, otpResult!.id);

      const error: any = new Error("Otp is incorrect");
      error.status = 400;
      error.code = errorCode.invalid;
      return next(handleError("Otp is incorrect", 400, errorCode.invalid));
    }

    //all are ok
    const verifiedToken = generateToken();
    const latestOtpData = {
      verifyToken: verifiedToken,
      error: 0,
      count: 1,
    };
    const finalResult = await updateOtp(latestOtpData, otpResult!.id);

    res.status(200).json({
      message: "OTP is successfully verified to reset password",
      phone: finalResult.phone,
      token: finalResult.verifyToken,
    });
  },
];
export const resetPassowrd = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Invalid Phone Number"),
  body("password", "Invalid Credentials")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 8, max: 8 }),
  body("token", "Invalid token").trim().notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({
      onlyFirstError: true,
    });

    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }
    const { token, password } = req.body;
    const user = await getUserByPhone(phone);
    await checkUserIfNotExist(user);

    const otpResult = await getOtpByPhone(phone);
    await checkOtpExist(otpResult);
    if (otpResult!.error === 5) {
      const error: any = new Error("Something went wrong. Try again later");
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }
    if (otpResult!.verifyToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpData, otpResult!.id);

      return next(
        handleError(
          "Something went wrong. Try again later",
          400,
          errorCode.invalid
        )
      );
    }

    const isRequestExpired = moment().diff(otpResult!.updatedAt, "minutes") > 5;
    if (isRequestExpired) {
      const error: any = new Error("You request is Expired");
      error.status = 400;
      error.code = errorCode.requestExpired;
      return next(
        handleError("You request is Expired", 400, errorCode.requestExpired)
      );
    }

    //if everything fine
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //     const newUser = await createNewUser(userData);

    const accessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, phone: user!.phone };

    const generateAccessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 * 15 }
    );

    const generateRefreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "30d" }
    );
    const updateUserData = {
      phone,
      password: hashedPassword,
      randomToken: generateRefreshToken,
    };
    const updatedUser = await updateUser(updateUserData, user!.id);

    const option: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    };

    res
      .cookie("accessToken", generateAccessToken, {
        ...option,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", generateRefreshToken, {
        ...option,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(201)
      .json({
        message: "Successfully updated password",
        userId: updatedUser!.id,
      });
  },
];
