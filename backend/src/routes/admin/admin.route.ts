import express from "express";
import { getAllusers } from "../../controllers/admin/admin.con";
import { Maintenance } from "../../controllers/admin/setting.con";
import {
  createPost,
  removeSinglePost,
  updatePost,
} from "../../controllers/admin/post.con";
import uploadMiddlware from "../../middleware/uploadFiles";
import {
  createProduct,
  removeProduct,
  updateProduct,
} from "../../controllers/admin/product.con";

const router = express.Router();

router.get("/get-users", getAllusers);
router.post("/maintenance", Maintenance);

// CRUD for Posts
router.post("/posts/create", uploadMiddlware.single("postImg"), createPost);
router.patch("/posts/update", uploadMiddlware.single("postImg"), updatePost);
router.delete("/posts/remove", removeSinglePost);

// CRUD for Posts
router.post(
  "/products/create",
  uploadMiddlware.array("productImg", 4),
  createProduct
);
router.patch(
  "/products/update",
  uploadMiddlware.array("productImg", 4),
  updateProduct
);
router.delete("/products/remove", removeProduct);
export default router;
