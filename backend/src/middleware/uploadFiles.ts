import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../upload/images"));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadMiddlware = multer({
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, //max 5MB
  storage: fileStorage,
});

export const uploadMemory = multer({
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 15 }, //max 5MB
  storage: multer.memoryStorage(),
});

export default uploadMiddlware;
