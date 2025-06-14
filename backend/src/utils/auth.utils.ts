import { errorCode } from "../../config/errorCode";
import { handleError } from "./handleError";
export const checkUserExist = async (user: any) => {
  if (user) {
    throw handleError(
      "This phone number is already in use",
      409,
      errorCode.userExist
    );
  }
};

export const checkOtpErrorInOneDay = async (
  isSameDate: boolean,
  errorCount: number
) => {
  if (isSameDate && errorCount > 5) {
    throw handleError(
      "OTP is wrong for 5 times. Try again after 24 hours",
      401,
      errorCode.overLimit
    );
  }
};

export const checkOtpExist = async (otp: any) => {
  if (!otp) {
    throw handleError(
      "OTP is wrong for 5 times. Try again after 24 hours",
      400,
      errorCode.invalid
    );
  }
};

export const checkUserIfNotExist = async (user: any) => {
  if (!user) {
    throw handleError(
      "Unauthenticated user.Try Again!!!",
      409,
      errorCode.unthenticated
    );
  }
};

export const authoriseByRoles = async (
  permission: boolean,
  userRole: string,
  ...roles: string[]
) => {
  let roleResult = roles.includes(userRole);
  let grantAcess = true;
  if ((permission && !roleResult) || (!permission && roleResult)) {
    grantAcess = false;
  }
  return grantAcess;
};

export const checkFileIfNotExist = async (file: any) => {
  if (!file) {
    throw handleError("Invalid file", 400, errorCode.invalid);
  }
};
export const checkProductFileIfNotExist = async (files: any) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw handleError("Invalid file(s)", 400, errorCode.invalid);
  }
};
