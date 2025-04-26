import Article from "../models/Article.js";
import User from "../models/User.js";

const articleController = {
  getArticles: async (req, res) => {
    try {
      const { page = 1, limit = 6, category } = req.query;
      const skip = (page - 1) * limit;

      // Build query
      let query = {};
      if (category) {
        query.category = category;
      }

      const articles = await Article.find(query)
        .populate("author", "username userTitle profileImage")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Article.countDocuments(query);

      res.status(200).json({
        articles,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id)
        .populate("author", "name profileImage")
        .populate("category", "name");
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createArticle: async (req, res) => {
    try {
      const { title, content, category, image, location } = req.body;

      // 필수 필드 체크
      if (!title || !content || !category || !image) {
        return res.status(400).json({
          message: "Title, content, category, and image are required",
        });
      }

      // 카테고리 유효성 검사
      const validCategories = ["adventure", "culture", "food-cafe"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: "Invalid category",
        });
      }

      const newArticle = new Article({
        title,
        content,
        category,
        image,
        location: location
          ? {
              name: location.name || "Unknown Location",
              // 다른 location 관련 필드가 있다면 여기에 추가
            }
          : { name: "Unknown Location" }, // location이 없을 경우 기본값 설정
        author: req.user.id,
      });

      const savedArticle = await newArticle.save();
      const populatedArticle = await Article.findById(
        savedArticle._id
      ).populate("author", "username userTitle profileImage");

      res.status(201).json(populatedArticle);
    } catch (error) {
      console.error("Create article error:", error);
      res.status(500).json({
        message: "Failed to create article",
        error: error.message,
      });
    }
  },

  updateArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      if (article.author.toString() !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedArticle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      if (article.author.toString() !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await Article.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  saveArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      const user = await User.findById(req.user.id);

      if (!article.savedBy.includes(req.user.id)) {
        article.savedBy.push(req.user.id);
        user.savedArticles.push(article._id);
        await article.save();
        await user.save();
      }

      res.status(200).json({ message: "Article saved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  unsaveArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      const user = await User.findById(req.user.id);

      article.savedBy = article.savedBy.filter(
        (id) => id.toString() !== req.user.id
      );
      user.savedArticles = user.savedArticles.filter(
        (id) => id.toString() !== article._id.toString()
      );

      await article.save();
      await user.save();

      res.status(200).json({ message: "Article unsaved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default articleController;
