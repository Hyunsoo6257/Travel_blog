import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Pagination from "../components/Pagination";

function Home() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ARTICLES_PER_PAGE = 6;

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page) => {
    try {
      const response = await fetch(
        `/api/articles?page=${page}&limit=${ARTICLES_PER_PAGE}`
      );
      const data = await response.json();

      if (data && data.articles) {
        setArticles(data.articles);
        setTotalPages(Math.ceil(data.total / ARTICLES_PER_PAGE));
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
        {/* Hero Section */}
        <div className="mb-16 border-b border-gray-200">
          <div className="relative h-[60vh] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
              alt="Featured destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <div className="max-w-3xl">
                <div className="mb-4">
                  <span className="text-xs tracking-[0.2em] text-white font-light">
                    FEATURED DESTINATION
                  </span>
                </div>
                <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-4">
                  Journey Through Patagonia
                </h1>
                <div className="flex items-center space-x-6 text-white/90">
                  <p className="text-sm font-light tracking-wide max-w-xl">
                    Explore the untamed wilderness of South America's most
                    dramatic landscape
                  </p>
                  <span className="text-xs tracking-[0.2em] font-light">
                    BY <span className="font-serif">MICHAEL TORRES</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
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

export default Home;
