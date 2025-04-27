import { useState } from "react";

function CommentForm({ user, articleId, comments, setComments }) {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await fetch(`/api/comments/article/${articleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="mb-12">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-serif">
              {user.username?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="text-xs tracking-[0.1em] font-light">
          Commenting as{" "}
          <span className="font-serif">{user.username?.toUpperCase()}</span>
        </span>
      </div>
      <div className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full bg-white border-0 border-b border-gray-200 focus:ring-0 focus:border-gray-300 font-light text-sm p-4 min-h-[100px] resize-none"
          required
        />
        <button
          type="submit"
          className="absolute bottom-4 right-4 text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light transition-colors"
        >
          POST
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
