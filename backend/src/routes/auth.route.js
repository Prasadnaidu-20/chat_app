import express, { Router } from "express";
import { login, logout, signup, UpdateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";  

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile",protectRoute,UpdateProfile)

router.get("/check",protectRoute, checkAuth);

export default router;

