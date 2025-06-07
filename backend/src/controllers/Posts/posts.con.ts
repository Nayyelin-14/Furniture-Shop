import { body, param, query, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { NextFunction, Response, Request } from "express";
import { handleError } from "../../utils/handleError";
import { getUserById } from "../../services/auth.services";
import { checkUserIfNotExist } from "../../utils/auth.utils";
import {
  getAllpostByOffsetOrCursorPagi,
  getSinglePostById,
  getSinglePostByIdWithRelationships,
} from "../../services/posts.service";
import { checkIfPostExists } from "../../utils/check";
import { getOrSetCache } from "../../utils/chace";
interface CustomUserReq extends Request {
  userId?: number;
}
export const getSinglePost = [
  param("postId", "Invalid post id").isInt({ gt: 0 }),
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const { postId } = req.params;
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const cacheKey = `posts:${postId}`;
    const post = await getOrSetCache(cacheKey, async () => {
      return getSinglePostByIdWithRelationships(Number(postId));
    });
    // const modifiedPost = {
    //   title: post?.title,
    //   content: post?.content,
    //   image: "/optimizedImages/" + post?.image.split(".")[0] + ".webp",
    //   author:
    //     (post?.author.firstName ?? "Anonymous") +
    //     " " +
    //     (post?.author.lastName ?? ""),
    //   body: post?.body,
    //   category: post?.category,
    //   tags:
    //     post?.postTags && post.postTags.length > 0
    //       ? post.postTags.map((i) => i.name)
    //       : [],
    //   updatedAt: post?.updatedAt.toLocaleDateString("en-US", {
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric",
    //   }),
    // };
    await checkIfPostExists(post);

    res.status(200).json({ message: "creating post", postId, post });
  },
];
//offset-based pagination
export const getAllPostsByPagination = [
  query("page", "Page number must be unsigned integer")
    .isInt({ gt: 0 })
    .optional(),
  query("limit", "Limit number must be unsigned integer")
    .isInt({ gt: 4 })
    .optional(),
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const skip = (Number(page) - 1) * Number(limit);
    //  Page 1: (1 - 1) * 5 = 0 → skip 0 → fetch from post 1
    // Page 2: (2 - 1) * 5 = 5 → skip 5 → fetch from post 6
    // Page 3: (3 - 1) * 5 = 10 → skip 10 → fetch from post 11
    const options = {
      skip,
      take: Number(limit) + 1, // get 1 extra to check if there's a next page
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            fullName: true,
          },
        },
        modifiedUpdatedAt: true,
        modifiedImage: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    };

    //  GET /api/posts?page=2&limit=5
    // Then req.query will be:
    // {
    //   page: "2",
    //   limit: "5"
    // }
    // If you do:JSON.stringify(req.query)
    // You get '{"page":"2","limit":"5"}'
    // const post = await getAllpostByOffsetOrCursorPagi(options);
    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return getAllpostByOffsetOrCursorPagi(options);
    });
    const hasNextPage = posts.length > +limit;
    const previousPage = +page !== 1 ? +page - 1 : null;
    let nextPage = null;
    if (hasNextPage) {
      posts.pop(); //5 khu pl u ml , kyn tr ko remove
      nextPage = +page + 1;
    }
    res.status(200).json({
      message: "creating post",
      limit,
      currentPage: page,
      hasNextPage,
      nextPage,
      posts,
      previousPage,
    });
  },
];

//cursor-based pagination
export const getAllPostsByInfinitePagination = [
  query("cursor", "Cursor number must be post id").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned integer")
    .isInt({ gt: 4 })
    .optional(),
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(handleError(errors[0].msg, 400, errorCode.invalid)); //This next(error) skips all other routes/middlewares and jumps directly to your error-handling middleware:
    }
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);
    const lastCursor = req.query.cursor;
    console.log("cursor ", lastCursor);
    const limit = req.query.limit || 5;
    const options = {
      skip: lastCursor ? 1 : 0, //	cursor ကို exclude (မထည့်) လုပ်ဖို့
      cursor: lastCursor ? { id: Number(lastCursor) } : undefined,
      take: Number(limit) + 1, // get 1 extra to check if there's a next page
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            fullName: true,
          },
        },
        modifiedUpdatedAt: true,
        modifiedImage: true,
      },
      orderBy: {
        id: "asc",
      },
    };

    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return getAllpostByOffsetOrCursorPagi(options);
    });
    const hasNextPage = posts.length > Number(limit);
    if (hasNextPage) {
      posts.pop();
    }

    const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
    res
      .status(200)
      .json({ message: "Get infinit post", posts, hasNextPage, newCursor });
  },
];
