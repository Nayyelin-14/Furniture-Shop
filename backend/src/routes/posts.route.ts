import { Router } from "express";
import {
  getAllPostsByInfinitePagination,
  getAllPostsByPagination,
  getSinglePost,
} from "../controllers/Posts/posts.con";
import { authMiddleware } from "../middleware/authMiddleware";

const route = Router();

route.get("/all-posts", authMiddleware, getAllPostsByPagination); //offset pagination
route.get("/allPosts", authMiddleware, getAllPostsByInfinitePagination); //cursor pagination
route.get("/post/:postId", authMiddleware, getSinglePost);

export default route;
