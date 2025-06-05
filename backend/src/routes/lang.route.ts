import { Router } from "express";

import { chnageLanguage } from "../controllers/changeLang.con";
const route = Router();

route.post("/change-language", chnageLanguage);
export default route;
