import express, { Router } from "express";
import { login, logout, signup, UpdateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";  
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.put("/update-profile",protectRoute, upload.single("profilePic"), UpdateProfile);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check",protectRoute, checkAuth);


export default router;

