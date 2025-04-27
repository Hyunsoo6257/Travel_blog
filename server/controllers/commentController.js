import Comment from "../models/Comment.js";

const commentController = {
  getComments: async (req, res) => {
    try {
      const comments = await Comment.find({
        article: req.params.articleId,
        isDeleted: false,
      })
        .populate("author", "username profileImage userTitle")
        .sort("-createdAt");

      // comments를 순회하면서 각 comment에 canEdit 필드 추가
      const commentsWithCanEdit = comments.map((comment) => ({
        ...comment.toObject(),
        canEdit: req.user
          ? req.user.isAdmin || comment.author._id.toString() === req.user.id
          : false,
      }));

      res.status(200).json(commentsWithCanEdit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createComment: async (req, res) => {
    try {
      const { content } = req.body;
      const newComment = new Comment({
        content,
        article: req.params.articleId,
        author: req.user.id,
      });

      await newComment.save();

      const populatedComment = await Comment.findById(newComment._id).populate(
        "author",
        "username profileImage userTitle"
      );

      // 새로 생성된 댓글에도 canEdit 추가
      const commentWithCanEdit = {
        ...populatedComment.toObject(),
        canEdit: true, // 작성자 본인이므로 항상 true
      };

      res.status(201).json(commentWithCanEdit);
    } catch (error) {
      console.error("Error in createComment:", error);
      res.status(500).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this comment" });
      }

      comment.content = req.body.content;
      await comment.save();

      // 업데이트된 댓글 반환 시에도 canEdit 필드 추가
      const updatedComment = await Comment.findById(comment._id).populate(
        "author",
        "username profileImage userTitle"
      );

      // canEdit 필드 추가
      const commentWithCanEdit = {
        ...updatedComment.toObject(),
        canEdit: true, // 수정 권한이 있는 사용자이므로 true
      };

      res.status(200).json(commentWithCanEdit);
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

      // admin이나 작성자 본인인 경우 삭제 가능
      if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this comment" });
      }

      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default commentController;
