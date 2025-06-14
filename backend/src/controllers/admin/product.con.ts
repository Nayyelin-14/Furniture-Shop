import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { handleError } from "../../utils/handleError";
import { errorCode } from "../../../config/errorCode";
import path from "path";
import { unlink } from "fs/promises";
import sanitizeHtml from "sanitize-html";
import {
  checkFileIfNotExist,
  checkProductFileIfNotExist,
} from "../../utils/auth.utils";
import imageQueue from "../../job/queues/imageQueue";
import {
  createSingleProduct,
  deleteProductById,
  getSingelProduct,
  updateSingleProduct,
} from "../../services/product.service";
import cacheQueue from "../../job/queues/cacheQueue";
import { checkIfProductExists } from "../../utils/check";
interface CustomId extends Request {
  user?: any;
}
export const getAllusers = (
  req: CustomId,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  res.status(200).json({ message: req.t("welcome"), user });
};

interface CustomReq extends Request {
  user?: any;
  userId?: string;
  files?: any;
}

const removeFiles = async (
  originalFilePaths: string[],
  optimizedFilePaths: string[] | null
) => {
  try {
    for (const filePath of originalFilePaths) {
      const originalImgPath = path.join(
        __dirname,
        "../../../upload/images/",
        filePath
      );
      await unlink(originalImgPath);
    }

    if (optimizedFilePaths) {
      for (const filePath of optimizedFilePaths) {
        const optimiziedImgPath = path.join(
          __dirname,
          "../../../upload/optimizedImages/",
          filePath
        );
        await unlink(optimiziedImgPath);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const createProduct = [
  body("name", "Name is required").trim().notEmpty().escape(),
  body("description", "Description is required")
    .notEmpty()
    .trim()
    .customSanitizer((value) => sanitizeHtml(value)),
  body("price", "Price is required")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),

  body("inventory", "Inventory is required").isInt({ min: 1 }),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("productTags", "Product tag is invalid")
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
      if (req.files && req.files.length > 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        console.log(originalFiles);
        await removeFiles(originalFiles, null);
      }
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    const productImg =
      req.files && req.files.length > 0
        ? req.files.map((file: any) => file.filename)
        : null;
    console.log(productImg);
    await checkProductFileIfNotExist(productImg);
    const {
      name,
      description,
      price,
      discount,
      category,
      type,
      productTags,
      inventory,
    } = req.body;

    await Promise.allSettled(
      req.files.map(async (file: any) => {
        try {
          const splitFileName = file.filename.split(".")[0];
          return await imageQueue.add(
            "optimized-productImg",
            {
              filePath: file.path,
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
        } catch (err) {
          throw err;
        }
      })
    );
    const originalFileNames = req.files.map((file: any) => ({
      path: file.filename,
    }));
    console.log(originalFileNames);
    const productData: any = {
      name,
      description,
      price,
      discount,
      category,
      type,
      productTags,
      inventory: Number(inventory),
      images: originalFileNames,
    };
    const product = await createSingleProduct(productData);

    await cacheQueue.add(
      "invalidate-product-cache",
      {
        pattern: `products:*`,
      },
      {
        jobId: `invalidate-${Date.now}`,
        priority: 1,
      }
    );
    res.status(201).json({
      message: "Successfully created a new product",
      product: product.id,
    });
  },
];

export const updateProduct = [
  body("productId", "Product id is required").isInt({ min: 1 }),
  body("name", "Name is required").trim().notEmpty().escape(),
  body("description", "Description is required")
    .notEmpty()
    .trim()
    .customSanitizer((value) => sanitizeHtml(value)),
  body("price", "Price is required")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Diescount is required")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),

  body("inventory", "Inventory is required").isInt({ min: 1 }),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("productTags", "Product tag is invalid")
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
      if (req.files && req.files.length > 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        console.log(originalFiles);
        await removeFiles(originalFiles, null);
      }
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const originalFiles =
      req.files && req.files.length > 0
        ? req.files.map((file: any) => ({ path: file.filename }))
        : null;

    await checkFileIfNotExist(originalFiles);

    const {
      productId,
      name,
      description,
      price,
      discount,
      category,
      type,
      productTags,
      inventory,
    } = req.body;
    const product = await getSingelProduct(Number(productId));

    if (!product) {
      if (req.files && req.files.length > 0) {
        const originalFileNames = req.files.map((file: any) => file.filename);
        await removeFiles(originalFileNames, null);
      }
      return next(handleError("Product doesn't exist", 409, errorCode.invalid));
    }

    if (req.files && req.files.length > 0) {
      //delete img if update data has new img
      const originalImgfromDB = product.images.map((file: any) => file.path);
      const ImgFromOptimized = product.images.map(
        (file: any) => file.path.split(".")[0] + ".webp"
      );
      await removeFiles(originalImgfromDB, ImgFromOptimized);
      //
      await Promise.allSettled(
        req.files.map(async (file: any) => {
          try {
            const splitFileName = file.filename.split(".")[0];
            return await imageQueue.add(
              "optimized-productImg",
              {
                filePath: file.path,
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
          } catch (err) {
            throw err;
          }
        })
      );
    }

    const productData: any = {
      name,
      description,
      price,
      discount,
      category,
      type,
      productTags,
      inventory: Number(inventory),
      images: originalFiles,
    };
    const updatedProduct = await updateSingleProduct(
      Number(productId),
      productData
    );

    await cacheQueue.add(
      "invalidate-product-cache",
      {
        pattern: `products:*`,
      },
      {
        jobId: `invalidate-${Date.now}`,
        priority: 1,
      }
    );
    res.status(201).json({
      message: "Successfully updated a  product",
      product: updatedProduct,
    });
  },
];

export const removeProduct = [
  body("productId", "Product Id is required").isInt({ gt: 0 }),

  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      if (req.files && req.files.length > 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        console.log(originalFiles);
        removeFiles(originalFiles, null);
      }
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    const { productId } = req.body;

    const product = await getSingelProduct(Number(productId));
    await checkIfProductExists(product);

    const deletedProduct = await deleteProductById(productId);
    const normalImage = product!.images.map((img: any) => img.path);
    const optimizedImage = product!.images.map(
      (img: any) => img.path.split(".")[0] + ".webp"
    );
    await removeFiles(normalImage, optimizedImage);

    await cacheQueue.add(
      "invalidate-product-cache",
      {
        pattern: "products:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: `Product ${deletedProduct.id} is deleted successfully`,
    });
  },
];
