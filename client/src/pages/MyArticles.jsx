import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

function MyArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch user's articles
    const fetchMyArticles = async () => {
      try {
        const response = await fetch("/api/posts/my-articles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchMyArticles();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F8]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold mb-8">My Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {articles.map((article) => (
            <Card key={article._id} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyArticles;
