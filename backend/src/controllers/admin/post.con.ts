import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { handleError } from "../../utils/handleError";

import sanitizeHtml from "sanitize-html";
import { checkFileIfNotExist } from "../../utils/auth.utils";
import imageQueue from "../../job/queues/imageQueue";
import {
  createSinglePost,
  getSinglePostById,
  PostTypes,
  removePostById,
  updatePostById,
} from "../../services/posts.service";
import path from "path";
import { unlink } from "fs/promises";
import { checkIfPostExists } from "../../utils/check";
import cacheQueue from "../../job/queues/cacheQueue";
interface CustomReq extends Request {
  user?: any;
}

const removeFiles = async (
  originalFilePath: string,
  optimizedFilePath: string | null
) => {
  try {
    const originalImgPath = path.join(
      __dirname,
      "../../../upload/images/" + originalFilePath
    );
    await unlink(originalImgPath);

    if (optimizedFilePath) {
      const optimiziedImgPath = path.join(
        __dirname,
        "../../../upload/optimizedImages/",
        optimizedFilePath
      );
      await unlink(optimiziedImgPath);
    }
  } catch (error) {
    console.log(error);
  }
};
export const createPost = [
  body("title", "Title is required").trim().notEmpty().escape(),
  body("content", "Content is required").trim().notEmpty().escape(),
  body("body", "Body is required")
    .trim()
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("tags", "Tag is invalid")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
        // value = "tech,ai,space";
        // value.split(",") = ["tech", "ai", "space"];
      }
    }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      if (req.file) {
        removeFiles(req.file?.filename!, null);
      }
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    const productImg = req.file;
    checkFileIfNotExist(productImg);
    const { title, category, content, body, type, tags } = req.body;
    const user = req.user;

    if (!user) {
      if (req.file) {
        removeFiles(req.file?.filename!, null);
      }
      throw handleError(
        "Unauthenticated user.Try Again!!!",
        409,
        errorCode.unthenticated
      );
    }

    const fileName = productImg?.filename.split(".")[0];
    imageQueue.add(
      "optimizedProductImg",
      {
        filePath: productImg?.path,
        fileName: `${fileName}.webp`,
        width: 835,
        height: 577,
        quality: 80,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );
    //fix data to send to database
    const dataToCreate: PostTypes = {
      title,
      body,
      content,
      author: user!.id,
      category,
      tags,
      type,
      image: req!.file?.filename!,
    };
    const post = await createSinglePost(dataToCreate);

    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      }
    );
    res
      .status(201)
      .json({ message: "Successfully created a new post", postId: post.id });
  },
];

export const updatePost = [
  body("postId", "Post id is required").notEmpty().isInt({ min: 1 }).trim(),
  body("title", "Title is required").trim().notEmpty().escape(),
  body("body", "body is required")
    .notEmpty()
    .trim()
    .customSanitizer((value) => sanitizeHtml(value)),
  body("content", "Content is required").notEmpty().trim().escape(),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("tags", "Tag is invalid")
    .optional()
    .customSanitizer((value) => {
      if (value) {
        return value
          .split(",")
          .filter((tagname: string) => tagname.trim() !== "");
      }
    }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const productImg = req?.file;
    // checkFileIfNotExist(productImg); // not now
    const { postId, title, category, content, body, type, tags } = req.body;
    // const userId = req.userId;
    // const user = await getUserById(userId!);
    // if (!user) {
    //   if (productImg) {
    //     removeFiles(productImg?.filename!, null);
    //   }
    //   throw handleError(
    //     "Unauthenticated user.Try Again!!!",
    //     409,
    //     errorCode.unthenticated
    //   );
    // }
    const user = req.user;
    const oldPost = await getSinglePostById(Number(postId));
    if (!oldPost) {
      if (productImg) {
        removeFiles(productImg?.filename!, null);
      }
      throw handleError(
        "Data doesn't exist for this post",
        401,
        errorCode.invalid
      );
    }

    //admin A can create/updated/delete  post one
    //admin B cannot come to create/update/delete to post one that not his post
    if (user!.id !== oldPost!.authorId) {
      if (productImg) {
        removeFiles(productImg?.filename!, null);
      }
      throw handleError(
        "You are not belong to this post",
        403,
        errorCode.unauthorized
      );
    }
    const dataToUpdate: any = {
      title,
      body,
      content,
      author: user.id,
      category,
      tags,
      type,
    };
    if (productImg) {
      const imageTodelete = oldPost.image.split(".")[0] + ".webp";

      await removeFiles(oldPost.image, imageTodelete);

      dataToUpdate.image = req!.file?.filename!;

      const splitFileName = req.file?.filename.split(".")[0];
      await imageQueue.add(
        "optimizedProductImg",
        {
          filePath: req.file?.path,
          fileName: `${splitFileName}.webp`,
          width: 835,
          height: 577,
          quality: 80,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        }
      );
    }

    const updatePost = await updatePostById(oldPost!.id, dataToUpdate);

    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      }
    );
    res
      .status(200)
      .json({ message: `Successfully updated post id ${updatePost.id}` });
  },
];
export const removeSinglePost = [
  body("postId", "Post id is required").notEmpty().isInt({ min: 1 }).trim(),

  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const user = req.user;

    const { postId } = req.body;
    const post = await getSinglePostById(Number(postId));
    await checkIfPostExists(post);

    if (user!.id !== post!.authorId) {
      throw handleError(
        "You are not belong to this post",
        403,
        errorCode.unauthorized
      );
    }
    const singlePostToDelete = await removePostById(Number(post!.id));
    const optimizedFilename = post!.image.split(".")[0] + ".webp";
    await removeFiles(post!.image, optimizedFilename);
    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      }
    );
    res.status(200).json({
      message: `Successfully deleted post id ${singlePostToDelete.id}`,
    });
  },
];
