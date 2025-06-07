import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { authroiseMiddleware } from "../middleware/authorise";
import adminRoutes from "../routes/admin/admin.route";
import authRoutes from "./auth.route";
import userRoutes from "../routes/users/users.route";
import { checkMaintenance } from "../middleware/maintananceCheck";
import postRoutes from "../routes/posts.route";
import productRoutes from "../routes/products.route";
const route = Router();

route.use(
  "/api/admin",
  checkMaintenance,
  authMiddleware,
  authroiseMiddleware(true, "ADMIN"),
  adminRoutes
);
route.use("/api/auth", checkMaintenance, authRoutes);
route.use("/api/users", checkMaintenance, authMiddleware, userRoutes);
route.use("/api/users", checkMaintenance, authMiddleware, postRoutes);
route.use("/api/users", checkMaintenance, authMiddleware, productRoutes);

export default route;
