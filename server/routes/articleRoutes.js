import express from "express";
const router = express.Router();
import articleController from "../controllers/articleController.js";
import auth from "../middleware/auth.js";

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticle);
router.post("/", auth, articleController.createArticle);
router.put("/:id", auth, articleController.updateArticle);
router.delete("/:id", auth, articleController.deleteArticle);
router.post("/:id/save", auth, articleController.saveArticle);
router.delete("/:id/save", auth, articleController.unsaveArticle);

export default router;
