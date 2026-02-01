import express from "express";

import { loginController, registerController , logoutController, verifyPasswordController, getUserDetailsController} from "../controller/auth.controller.js";

import {authMiddlware} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/logout",authMiddlware, logoutController);
router.post("/verify-password",authMiddlware, verifyPasswordController);
router.get("/me",authMiddlware , getUserDetailsController);

export default router;