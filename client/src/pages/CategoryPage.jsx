import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Pagination from "../components/Pagination";

function CategoryPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ARTICLES_PER_PAGE = 6;

  useEffect(() => {
    fetchCategoryArticles(currentPage);
  }, [slug, currentPage]);

  const fetchCategoryArticles = async (page) => {
    try {
      const response = await fetch(
        `/api/articles?category=${slug}&page=${page}&limit=${ARTICLES_PER_PAGE}`
      );
      const data = await response.json();

      if (data && data.articles) {
        setArticles(data.articles);
        setTotalPages(Math.ceil(data.total / ARTICLES_PER_PAGE));
      } else {
        console.error("Unexpected API response structure:", data);
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching category articles:", error);
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
        {/* Category Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
            CATEGORY
          </div>
          <h1 className="font-serif text-3xl">
            {slug.toUpperCase().replace("-", " & ")}
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

        {/* Pagination */}
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
