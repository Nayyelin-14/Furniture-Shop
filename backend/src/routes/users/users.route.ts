import { Router } from "express";
import uploadMiddlware, { uploadMemory } from "../../middleware/uploadFiles";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  uploadMultipleProfile,
  uploadOptimizedProfile,
  uploadProfile,
} from "../../controllers/users/users.con";
import {
  getAllPostsByPagination,
  getSinglePost,
} from "../../controllers/Posts/posts.con";

const route = Router();

route.patch(
  "/profile/upload",

  uploadMiddlware.single("avatar"),
  uploadProfile
);
route.patch(
  "/profile/upload/multiple",

  uploadMiddlware.array("avatar"),
  uploadMultipleProfile
);

route.patch(
  "/profile/upload/optimized",

  uploadMiddlware.single("avatar"),
  uploadOptimizedProfile
);

route.get("/all-posts", getAllPostsByPagination);
route.get(`/post/:postId`, getSinglePost);
export default route;
