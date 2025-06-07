import { body, param, query, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { NextFunction, Response, Request } from "express";
import { handleError } from "../../utils/handleError";
import { getUserById } from "../../services/auth.services";
import { checkUserIfNotExist } from "../../utils/auth.utils";

import { getOrSetCache } from "../../utils/chace";
import {
  getAllProductListByPagi,
  getProductWithRealations,
} from "../../services/product.service";
import { checkIfProductExists } from "../../utils/check";
interface CustomUserReq extends Request {
  userId?: number;
}
export const getSingleProduct = [
  param("productId", "Invalid product id").isInt({ gt: 0 }),
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const { productId } = req.params;
    console.log(productId);
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const cacheKey = `products:${productId}`;
    const product = await getOrSetCache(cacheKey, async () => {
      return await getProductWithRealations(Number(productId));
    });
    checkIfProductExists(product);

    res.status(200).json({ productId, product });
  },
];

export const getProductsWithPagi = [
  query("cursor", "Cursor number must be post id").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned integer")
    .isInt({ gt: 4 })
    .optional(),
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({
      onlyFirstError: true,
    });

    if (errors.length > 0) {
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);
    const category = req.query.category;
    const type = req.query.type;

    let categoryList: number[] = [];
    let typeList: number[] = [];
    if (category) {
      categoryList = category
        .toString()
        .split(",")
        .map((c) => Number(c))
        .filter((c) => c > 0);
    }
    if (type) {
      typeList = type
        .toString()
        .split(",")
        .map((t) => Number(t))
        .filter((t) => t > 0);
    } // req.query ကနေ ရလာတဲ့ category string အရင် string ဖြစ်အောင်လုပ်ပြီး, , (comma) နဲ့ ခွဲပြီး, number ပြောင်းပြီးနောက်မှာ positive (0 ထက်ကြီးတဲ့) value တွေကိုသာ filter လုပ်တဲ့ logic ဖြစ်ပါတယ်။

    const filterKey = {
      AND: [
        categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
        typeList.length > 0 ? { typeId: { in: typeList } } : {},
      ],
    };
    const options = {
      where: filterKey,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: Number(lastCursor) } : undefined,
      take: Number(limit) + 1,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        rating: true,
        status: true,
        discount: true,
        inventory: true,
        images: {
          select: {
            id: true,
            path: true,
          },
          take: 1, //take the first image
        },
      },
      orderBy: {
        id: "desc",
      },
    };

    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const products = await getOrSetCache(cacheKey, async () => {
      return await getAllProductListByPagi(options);
    });
    const hasNextPage = products.length > limit;
    if (hasNextPage) {
      products.pop();
    }
    const newCursor =
      products.length > 0 ? products[products.length - 1].id : null;

    res.status(200).json({
      products,
      hasNextPage,
      newCursor,
    });
  },
];
