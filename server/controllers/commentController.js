import Comment from "../models/Comment.js";

const commentController = {
  getComments: async (req, res) => {
    try {
      const comments = await Comment.find({
        article: req.params.articleId,
        isDeleted: false,
      })
        .populate("author", "name profileImage")
        .populate({
          path: "parentComment",
          populate: {
            path: "author",
            select: "name profileImage",
          },
        })
        .sort("-createdAt");

      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createComment: async (req, res) => {
    try {
      const { content, parentCommentId } = req.body;
      const newComment = new Comment({
        content,
        article: req.params.articleId,
        author: req.user.id,
        parentComment: parentCommentId || null,
      });

      await newComment.save();

      const populatedComment = await Comment.findById(newComment._id).populate(
        "author",
        "name profileImage"
      );

      res.status(201).json(populatedComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.author.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this comment" });
      }

      comment.content = req.body.content;
      comment.updatedAt = Date.now();
      await comment.save();

      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this comment" });
      }

      comment.isDeleted = true;
      await comment.save();

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  likeComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (!comment.likes.includes(req.user.id)) {
        comment.likes.push(req.user.id);
        await comment.save();
      }

      res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  unlikeComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      comment.likes = comment.likes.filter(
        (userId) => userId.toString() !== req.user.id
      );
      await comment.save();

      res.status(200).json({ message: "Comment unliked successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default commentController;
