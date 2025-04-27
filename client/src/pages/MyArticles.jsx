import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Pagination from "../components/Pagination";

function MyArticles() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ARTICLES_PER_PAGE = 6;

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
      return;
    }
    fetchMyArticles(currentPage);
  }, [currentPage, user, navigate]);

  const fetchMyArticles = async (page) => {
    try {
      const response = await fetch(
        `/api/articles/my-articles?page=${page}&limit=${ARTICLES_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await response.json();

      if (data && data.articles) {
        setArticles(data.articles);
        setTotalPages(Math.ceil(data.total / ARTICLES_PER_PAGE));
      } else {
        console.error("Unexpected API response structure:", data);
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
            MY STORIES
          </div>
          <h1 className="font-serif text-3xl">
            Articles by {user?.username || "Me"}
          </h1>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {articles.map((article) => (
            <Card
              key={article._id}
              id={article._id}
              category={article.category.toUpperCase().replace("-", " & ")}
              title={article.title}
              description={article.content.substring(0, 100) + "..."}
              author={article.author.username}
              authorRole={article.author.userTitle}
              image={article.image}
              authorImage={article.author.profileImage}
            />
          ))}
        </div>

        {/* No Articles Message */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-light tracking-wide">
              You haven't written any articles yet.
            </p>
          </div>
        )}

        {/* Pagination */}
        {articles.length > 0 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default MyArticles;
