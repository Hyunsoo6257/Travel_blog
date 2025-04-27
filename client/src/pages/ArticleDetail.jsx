import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Comments from "../components/Comments";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to fetch article");
      }

      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/create-article`, {
      state: {
        isEditing: true,
        articleData: article,
      },
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        navigate("/my-articles");
      } else {
        throw new Error("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article");
    }
  };

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/article/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, user]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F7F3EE]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Category */}
        <div className="text-xs tracking-[0.2em] text-gray-600 font-light mb-4">
          {article.category?.toUpperCase() || "UNCATEGORIZED"}
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl font-bold leading-tight mb-8">
          {article.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center mb-10 border-t border-gray-200 pt-4">
          <div className="w-7 h-7 bg-[#F5F5F8] rounded-full overflow-hidden">
            {article.author?.profileImage ? (
              <img
                src={article.author.profileImage}
                alt={article.author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-serif">
                  {article.author?.username?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="text-xs tracking-[0.2em] font-light">
              BY{" "}
              <span className="font-serif">
                {article.author?.username?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
            <div className="text-xs tracking-[0.1em] text-gray-500 font-light mt-1">
              {article.author?.userTitle?.toUpperCase() || "GUEST"} ·{" "}
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] bg-gray-100 mb-10 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="font-light text-base leading-relaxed tracking-wide">
          <p className="mb-4">{article.content}</p>
        </div>

        {/* Edit/Delete Buttons */}
        {article.canEdit && (
          <div className="mt-12 flex justify-end space-x-4">
            <Button
              onClick={handleEdit}
              className="px-4 py-2 text-xs tracking-[0.2em]"
            >
              EDIT
            </Button>
            <Button
              onClick={handleDelete}
              className="px-4 py-2 text-xs tracking-[0.2em] bg-red-600 hover:bg-red-700"
            >
              DELETE
            </Button>
          </div>
        )}

        {/* Comments Section */}
        <Comments
          user={user}
          articleId={id}
          comments={comments}
          setComments={setComments}
        />
      </article>
    </div>
  );
}

export default ArticleDetail;
