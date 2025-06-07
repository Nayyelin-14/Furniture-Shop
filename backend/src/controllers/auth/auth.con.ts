import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { CookieOptions } from "express";

import {
  createNewUser,
  getUserById,
  getOtpByPhone,
  getUserByPhone,
  storeOtp,
  updateOtp,
  updateUser,
} from "../../services/auth.services";
import {
  checkOtpErrorInOneDay,
  checkOtpExist,
  checkUserExist,
  checkUserIfNotExist,
} from "../../utils/auth.utils";
import { generateOTP, generateToken } from "../../utils/generateOtp";
import bcrypt from "bcrypt";
import moment from "moment";
import { errorCode } from "../../../config/errorCode";
import { handleError } from "../../utils/handleError";

export const register = [
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
      error.code = "Invalid_Error";
      return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }
    //check user by ph function
    const isUser = await getUserByPhone(phone);

    //error return function
    checkUserExist(isUser);

    //generate OTP function
    const otp = 123456; //testing
    // const otp = generateOTP();
    //hash otp
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt);

    //generate Token function
    const token = generateToken();

    const otpHistory = await getOtpByPhone(phone);
    let otpResult;
    if (!otpHistory) {
      //store  new  otp data if there is no otp request history
      const otpData = {
        optCode: hashedOtp,
        phone,
        rememberToken: token,
        count: 1,
      };

      otpResult = await storeOtp(otpData);
    } else {
      //if there is otp request history
      //otp is wrong 5 times in one day
      const lastRequestDate = new Date(otpHistory.updatedAt)
        .toISOString()
        .split("T")[0];
      const currentDate = new Date().toISOString().split("T")[0];
      const isSameDate = lastRequestDate === currentDate;
      checkOtpErrorInOneDay(isSameDate, otpHistory.count);

      if (!isSameDate) {
        //reset error count and store new otp if not the same date
        const updateotpData = {
          optCode: hashedOtp,
          rememberToken: token,
          count: 1,
          error: 0,
        };
        otpResult = await updateOtp(updateotpData, otpHistory.id);
      } else {
        if (otpHistory.count === 3) {
          const error: any = new Error(
            "OTP is allowed to request to 3 times per day.Try again later"
          );
          error.status = 429;
          error.code = "Exceed_Limit";
          return next(error);
        } else {
          const updateotpData = {
            optCode: hashedOtp,
            rememberToken: token,
            count: {
              increment: 1,
            },
            error: 0,
          };
          otpResult = await updateOtp(updateotpData, otpHistory.id);
        }
      }
    }

    res.status(200).json({
      message: `We are sending otp to 09${otpResult.phone}`,
      phone: otpResult.phone,
      token: otpResult.rememberToken,
    });
  },
];
export const veridyOtp = [
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
      error.code = "Invalid_Error";
      return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    const { otp, token } = req.body;
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }
    //user can't be already  existed when verifying
    const isExistedUser = await getUserByPhone(phone);
    checkUserExist(isExistedUser);
    //there must have otp to verify

    const existedOtp = await getOtpByPhone(phone);
    checkOtpExist(existedOtp?.optCode);
    //-------//
    //otp is verified wrongly for  5 times in one day
    console.log(existedOtp);
    const lastVerifyDate = new Date(existedOtp!.updatedAt)
      .toISOString()
      .split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];

    const isSameDate = lastVerifyDate === currentDate;
    checkOtpErrorInOneDay(isSameDate, existedOtp!.error);
    //-------//

    //check token //

    if (existedOtp?.rememberToken !== token) {
      //if token is wrong , error and can't be verify again
      const otpData = {
        error: 5,
      };
      await updateOtp(otpData, existedOtp!.id);
      const error: any = new Error("Invalid Token");
      error.status = 400;
      error.code = "Error_Invalid";
      return next(error);
    }
    //====//

    //check otp is expired over 2 minutes//
    const isOtpExpired = moment().diff(existedOtp?.updatedAt, "minutes") > 2; //lek shi a chain nk minute htoke pyy pee 2 htk kyee yin expired
    if (isOtpExpired) {
      const error: any = new Error("Expired");
      error.status = 403;
      error.code = "Error_OTPExpired";
      return next(error);
    }
    //
    //check otp match or not
    const isOtpMatch = await bcrypt.compare(otp, existedOtp!.optCode);
    if (!isOtpMatch) {
      const otpData = isSameDate ? { error: { increment: 1 } } : { error: 1 };

      await updateOtp(otpData, existedOtp!.id);

      const error: any = new Error("OTP is incorrect");
      error.status = 401;
      error.code = "Error_Incorrect";
      return next(error);
    }
    //
    //if everything ok , an otp must have verify token for that account is verified
    const verifiedToken = generateToken();
    const latestOtpData = {
      verifyToken: verifiedToken,
      count: 1,
      error: 0,
    };
    const latestOtpResult = await updateOtp(latestOtpData, existedOtp!.id);
    //

    res.json({
      message: "OTP is successfully verified",
      phone: latestOtpResult.phone,
      token: latestOtpResult.verifyToken,
    });
  },
];
export const confirmPassword = [
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
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    const { password, token } = req.body;
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    //check user
    const existedUser = await getUserByPhone(phone);
    checkUserExist(existedUser);

    const otpResult = await getOtpByPhone(phone);
    checkOtpExist(otpResult);
    if (otpResult!.error > 5) {
      const error: any = new Error("Malware Function");
      error.status = 400;
      error.code = errorCode.overLimit;
      return next(error);
    }
    if (otpResult?.verifyToken !== token) {
      //if token is wrong , error and can't be verify again
      const otpData = {
        error: 5,
      };
      await updateOtp(otpData, otpResult!.id);
      const error: any = new Error("Invalid Token");
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }
    const isOtpExpired = moment().diff(otpResult?.updatedAt, "minutes") > 10; //lek shi a chain nk minute htoke pyy pee 10 mins htk kyee yin expired
    if (isOtpExpired) {
      const error: any = new Error("Your request is expired. Try again later");
      error.status = 403;
      error.code = errorCode.otpExpired;
      return next(error);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const randomToken = "will place later";
    const userData = { phone, randomToken, password: hashedPassword };
    const newUser = await createNewUser(userData);

    const accessTokenPayload = { id: newUser.id };
    const refreshTokenPayload = { id: newUser.id, phone: newUser.phone };

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
    const updateUserData = { randomToken: generateRefreshToken };
    await updateUser(updateUserData, newUser.id);

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
        message: "Successfully created a new account",
        userId: newUser.id,
      });
  },
];
export const login = [
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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const { password } = req.body;
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    if (user!.status === "FREEZE") {
      return next(
        handleError(
          "Your account has been locked. Try again later",
          403,
          errorCode.accountFreeze
        )
      );
    }
    const isMatchPassword = await bcrypt.compare(password, user!.password);
    const lastVerifyDate = new Date(user!.updatedAt)
      .toISOString()
      .split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];

    const isSameDate = lastVerifyDate === currentDate;
    if (!isMatchPassword) {
      if (!isSameDate) {
        const userData = {
          errorLoginCount: 1,
        };
        await updateUser(userData, user!.id);
      } else {
        if (user!.errorLoginCount >= 3) {
          const userDataToFreeze = {
            status: "FREEZE",
          };
          await updateUser(userDataToFreeze, user!.id);
        } else {
          const userData = {
            errorLoginCount: {
              increment: 1,
            },
          };
          await updateUser(userData, user!.id);
        }
      }

      const error: any = new Error("Invalid Credentials.Try Again");
      error.status = 401;
      error.code = errorCode.invalid;
      return next(
        handleError("Invalid Credentials.Try Again", 401, errorCode.invalid)
      );
    }
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
      randomToken: generateRefreshToken,
      errorLoginCount: 0,
    };
    await updateUser(updateUserData, user!.id);

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
      .status(200)
      .json({
        message: "Successfully Logged In",
        userId: user!.id,
      });
  },
];

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //acces ka 15 mins pl ya loh refreh 3
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  if (!refreshToken) {
    return next(
      handleError("Unauthenticated User", 401, errorCode.unthenticated)
    );
  }
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      id: number;
      phone: string;
    };
  } catch (err) {
    return next(handleError("Token is invalid", 400, errorCode.invalid));
  }
  const user = await getUserById(decoded.id);
  checkUserIfNotExist(user);

  if (user!.phone !== decoded.phone) {
    const error: any = new Error("Unauthenticated User");
    error.status = 401;
    error.code = errorCode.unthenticated;
    return next(error);
  }
  const updatedToken = generateToken();

  const userData = {
    randomToken: updatedToken,
  };
  await updateUser(userData, user!.id);
  const option: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };
  res
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json({
      message: "Loggedout successfully",
    });
};
