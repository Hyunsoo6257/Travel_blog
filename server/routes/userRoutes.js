import express from "express";
import userController from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes (require authentication)
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);

// Admin only routes
router.get("/all", auth, adminAuth, userController.getAllUsers);
router.delete("/:id", auth, adminAuth, userController.deleteUser);

export default router;
