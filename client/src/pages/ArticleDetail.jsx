import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // API 구현 예정
    setPost({
      title: "Sample Post Title",
      category: "Culture",
      content: "Lorem ipsum dolor sit amet...",
      author: "John Doe",
      authorRole: "Writer",
      createdAt: "2024-01-01",
    });
  }, [id]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Category */}
        <div className="text-xs tracking-[0.2em] text-gray-600 mb-4 font-light">
          {post.category.toUpperCase()}
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl font-bold leading-tight mb-8">
          {post.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center mb-10 border-t border-gray-200 pt-4">
          <div className="w-7 h-7 bg-[#F5F5F8] rounded-full flex items-center justify-center">
            <span className="text-xs font-serif">
              {post.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-xs tracking-[0.2em] font-light">
              BY <span className="font-serif">{post.author.toUpperCase()}</span>
            </div>
            <div className="text-xs tracking-[0.1em] text-gray-500 font-light mt-1">
              {post.authorRole.toUpperCase()} ·{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] bg-gray-100 mb-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="font-light text-base leading-relaxed tracking-wide">
          <p className="mb-4">{post.content}</p>
          {/* 실제 컨텐츠에 맞게 더 많은 단락 추가 */}
        </div>
      </article>
    </div>
  );
}

export default PostDetail;
