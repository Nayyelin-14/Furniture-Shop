import { Router } from "express";

import { authorization } from "../controllers/authrize.con";
import { authMiddleware } from "../middleware/authMiddleware";
const route = Router();

route.post("/role-permission", authorization);
export default route;
