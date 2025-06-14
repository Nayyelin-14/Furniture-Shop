import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import compression from "compression";
import morgan from "morgan";
import { rateLimiter } from "./middleware/rateLimiter";
import routes from "./routes";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";
import cron from "node-cron";
import middleware from "i18next-http-middleware";
import {
  createOrUpdateSettingStatus,
  getSettingStatus,
} from "./services/setting.service";
export const app = express();
const whitelist = ["http://localhost:5173", "https://yourdomain.com"];

const corsOptions: CorsOptions = {
  // callback(error: Error | null, allow?: boolean)
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser tools like curl/Postman
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //allow cookies or authorization header
};
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("upload/images"));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(compression({}));
app.use(rateLimiter);
app.use(helmet());
app.set("trust proxy", true);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src/locales",
        "{{lng}}",
        "{{ns}}.json"
      ),
    },
    detection: {
      order: ["querystring", "cookie"],
      cache: ["cookie"],
    },
    fallbackLng: "en",
    preload: ["en", "mm"],
  }); // tells i18next to use the file system backend
app.use(middleware.handle(i18next));
app.use(
  "/optimizedImages",
  express.static(path.join(__dirname, "../upload/optimizedImages"))
);
//for all routes
app.use(routes);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.status || 404;
  const message = error.message || "Something went wrong";
  const errorCode = error.code || "Error_code";
  res.status(status).json({ message, error: errorCode });
});

cron.schedule("* * 5 * *", async () => {
  console.log("Running a task every minute for testing purpose");
  const settingStatus = await getSettingStatus("maintenance");
  if (settingStatus?.value === "true") {
    await createOrUpdateSettingStatus("maintenance", "false");
    console.log("Now maintenance mode is off");
  }
});
