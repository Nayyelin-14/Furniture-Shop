import { Router } from "express";
import {
  getAllPostsByInfinitePagination,
  getAllPostsByPagination,
  getSinglePost,
} from "../controllers/Posts/posts.con";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getCategoriresandTypes,
  getProductsWithPagi,
  getSingleProduct,
  toggleFavourite,
} from "../controllers/Porducts/products.con";

const route = Router();

// route.get("/all-products", authMiddleware, getAllPostsByPagination); //offset pagination
// route.get("/allProducts", authMiddleware, getAllPostsByInfinitePagination); //cursor pagination

route.get("/products/:productId", getSingleProduct);
route.get("/products", getProductsWithPagi);
route.get("/categories-types", getCategoriresandTypes);

route.patch("/toggle-fav", toggleFavourite);
export default route;
