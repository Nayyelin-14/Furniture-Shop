import { NextFunction, Request, Response } from "express";
import { getUserById, updateUser } from "../../services/auth.services";
import {
  checkFileIfNotExist,
  checkUserIfNotExist,
} from "../../utils/auth.utils";
import { unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";
import imageQueue from "../../job/queues/imageQueue";
interface CustomId extends Request {
  userId?: number;
  file?: any;
}
export const uploadProfile = [
  async (req: CustomId, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const image = req.file;
    checkFileIfNotExist(image);
    console.log(image);

    if (user!.image!) {
      const imgPath = path.join(
        __dirname,
        "../../../upload/images",
        user!.image!
      );

      try {
        await unlink(imgPath);
      } catch (error) {
        console.log(error);
      }
    }

    const fileName = image!.filename;
    console.log(fileName);
    const userData = {
      image: fileName,
    };

    await updateUser(userData, user!.id);

    res.status(200).json({ message: "Profile picture updated sucessfully" });
  },
];

export const uploadMultipleProfile = async (
  req: CustomId,
  res: Response,
  next: NextFunction
) => {
  console.log("mutiple photos", req.files);
  res
    .status(200)
    .json({ message: "Multiple Profile picture updated sucessfully" });
};

export const uploadOptimizedProfile = async (
  req: CustomId,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);

  const image = req.file;
  checkFileIfNotExist(image);
  console.log("uplaoded image", image);
  const fileName = req.file?.filename.split(".")[1];

  // try {
  //   const optimizedImgPath = path.join(
  //     __dirname,
  //     "../../../upload/images",
  //     fileName
  //   );
  //   console.log(req.file?.buffer);
  //   console.log(req.file);
  //   await sharp(req.file?.buffer)
  //     .resize(200, 200)
  //     .webp({ quality: 50 })
  //     .toFile(optimizedImgPath);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Image optimization failed" });
  // }
  const queueJob = await imageQueue.add(
    "optimized_image",
    {
      fileName: `${fileName}.webp`,
      filePath: req.file?.path,
      width: 200,
      height: 200,
      quality: 50,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );

  if (user!.image!) {
    const originalImgPath = path.join(
      __dirname,
      "../../../upload/images",
      user!.image!
    );
    const optimizedImgPath = path.join(
      __dirname,
      "../../../upload/optimizedImages",
      user!.image!.split(".")[0] + ".webp"
    );
    try {
      await unlink(originalImgPath);
      await unlink(optimizedImgPath);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(fileName);
  const userData = {
    image: req?.file?.filename,
  };

  await updateUser(userData, user!.id);
  res.status(200).json({
    message: "Multiple Profile picture updated sucessfully",
    image: fileName + ".webp",
    jobId: queueJob!.id,
  });
};
