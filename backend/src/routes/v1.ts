import { Router } from "express";
import { check } from "../middleware/checkID";
import { Health } from "../controllers/health";
const route = Router();
//@ts-ignore
route.get("/check", check, Health);
export default route;
