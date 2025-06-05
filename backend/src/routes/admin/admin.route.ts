import express from "express";
import { getAllusers } from "../../controllers/admin/admin.con";
import { Maintenance } from "../../controllers/admin/setting.con";
import {
  createPost,
  removeSinglePost,
  updatePost,
} from "../../controllers/admin/post.con";
import uploadMiddlware from "../../middleware/uploadFiles";

const router = express.Router();

router.get("/get-users", getAllusers);
router.post("/maintenance", Maintenance);

// CRUD for Posts
router.post("/posts/create", uploadMiddlware.single("productImg"), createPost);
router.patch("/posts/update", uploadMiddlware.single("productImg"), updatePost);
router.delete("/posts/remove", removeSinglePost);

export default router;
