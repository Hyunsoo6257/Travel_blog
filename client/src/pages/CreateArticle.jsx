import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";

function CreateArticle() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageError, setImageError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    location: "", // Optional field
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Check authentication using user object
  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError(""); // Reset error message

    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setImageError("Image size should be less than 10MB");
        e.target.value = ""; // Reset file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user?.token) {
        navigate("/login");
        return;
      }

      const submitData = { ...formData };
      if (!submitData.location.trim()) {
        delete submitData.location;
      }

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const data = await response.json();
      navigate(`/article/${data._id}`);
    } catch (error) {
      console.error("Error creating article:", error);
      alert(error.message || "Failed to create article. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="min-h-screen bg-[#F7F3EE] py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
            NEW STORY
          </div>
          <h2 className="font-serif text-3xl mb-12">Create Your Story</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                CATEGORY
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-white border-0 border-b border-gray-200 focus:border-gray-300 focus:ring-0 text-sm font-light"
                required
              >
                <option value="">Select a category</option>
                <option value="adventure">ADVENTURE</option>
                <option value="culture">CULTURE</option>
                <option value="food-cafe">FOOD & CAFE</option>
              </select>
            </div>

            {/* Article Title */}
            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                TITLE
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter your story title"
                className="font-serif text-xl"
                required
              />
            </div>

            {/* Location (Optional) */}
            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                LOCATION (OPTIONAL)
              </label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location (optional)"
                className="font-light"
              />
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                FEATURED IMAGE
              </label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-xs file:font-semibold
                    file:bg-gray-50 file:text-gray-700
                    hover:file:bg-gray-100
                    file:tracking-[0.2em]"
                  required
                />
                {imageError && (
                  <p className="text-red-500 text-sm mt-1">{imageError}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Maximum image size: 10MB
                </p>
              </div>
            </div>

            {/* Article Content */}
            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                CONTENT
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Tell your story..."
                className="w-full min-h-[400px] bg-white border-0 border-b border-gray-200 
                  focus:border-gray-300 focus:ring-0 font-serif text-lg leading-relaxed 
                  resize-none p-4"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit">PUBLISH STORY</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateArticle;
