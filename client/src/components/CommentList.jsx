import React, { useState } from "react";

function CommentList({ comments, setComments, user }) {
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUser={user}
          setComments={setComments}
        />
      ))}
    </div>
  );
}

const CommentItem = ({ comment, currentUser, setComments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // 수정/삭제 권한 확인
  const canModifyComment =
    currentUser &&
    (currentUser.isAdmin || currentUser.id === comment.author._id);

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prev) =>
          prev.map((c) => (c._id === comment._id ? updatedComment : c))
        );
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c._id !== comment._id));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="border-b border-gray-100 pb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
            {comment.author?.profileImage ? (
              <img
                src={comment.author.profileImage}
                alt={comment.author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-serif">
                {comment.author?.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs tracking-[0.1em] font-serif">
              {comment.author?.username.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 font-light ml-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {canModifyComment && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-gray-500 hover:text-black"
            >
              {isEditing ? "CANCEL" : "EDIT"}
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-red-500 hover:text-red-700"
            >
              DELETE
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="pl-9">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded p-2 text-sm mb-2"
          />
          <button
            onClick={handleEdit}
            className="text-xs bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
          >
            SAVE
          </button>
        </div>
      ) : (
        <p className="font-light text-sm leading-relaxed pl-9">
          {comment.content}
        </p>
      )}
    </div>
  );
};

export default CommentList;
