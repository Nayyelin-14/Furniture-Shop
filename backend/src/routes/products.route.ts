import { Router } from "express";
import {
  getAllPostsByInfinitePagination,
  getAllPostsByPagination,
  getSinglePost,
} from "../controllers/Posts/posts.con";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getProductsWithPagi,
  getSingleProduct,
} from "../controllers/Porducts/products.con";

const route = Router();

// route.get("/all-products", authMiddleware, getAllPostsByPagination); //offset pagination
// route.get("/allProducts", authMiddleware, getAllPostsByInfinitePagination); //cursor pagination
route.get("/products/:productId", authMiddleware, getSingleProduct);
route.get("/products", authMiddleware, getProductsWithPagi);

export default route;
