import { Request, Response, NextFunction } from "express";
import { getSettingStatus } from "../services/setting.service";
import { errorCode } from "../../config/errorCode";
import { handleError } from "../utils/handleError";
const whiteLists = ["127.0.0.1"];
export const checkMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The x-forwarded-for header is usually set by a proxy, such as:NginxCloudflareLoad balancers (e.g., AWS ELB)If you're running your Express server locally or directly, this header won’t exist unless you manually set it.

  const ip: any = req.socket.remoteAddress || req.headers["x-forwarded-for"];
  if (whiteLists.includes(ip)) {
    console.log(`Allowed IP : ${ip}`);
    next();
  } else {
    console.log(`Not allow Allowed IP : ${ip}`);

    const settingStatus = await getSettingStatus("maintenance");

    if (settingStatus?.value === "true") {
      return handleError(
        "This server is currenly under maintenance. Please Try Again later",
        503,
        errorCode.maintenance
      );
    }
    next();
  }
};
