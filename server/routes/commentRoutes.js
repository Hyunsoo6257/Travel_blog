import express from "express";
const router = express.Router();
import commentController from "../controllers/commentController.js";
import auth from "../middleware/auth.js";

router.get("/article/:articleId", commentController.getComments);
router.post("/article/:articleId", auth, commentController.createComment);
router.put("/:id", auth, commentController.updateComment);
router.delete("/:id", auth, commentController.deleteComment);

export default router;
