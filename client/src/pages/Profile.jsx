import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";

function Profile() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setUsername(profileData.username);
          setUserTitle(profileData.userTitle || "");
          setImagePreview(profileData.profileImage || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile data");
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result); // Base64 문자열 저장
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 업데이트할 데이터만 포함
      const updateData = {};

      if (username.trim()) {
        updateData.username = username;
      }
      if (userTitle.trim()) {
        updateData.userTitle = userTitle;
      }
      if (imageFile) {
        // Base64 이미지
        updateData.profileImage = imageFile;
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser({ ...user, ...data });
        setSuccess("Profile updated successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("An error occurred while updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="min-h-screen bg-[#F7F3EE] py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
            PROFILE SETTINGS
          </div>
          <h2 className="font-serif text-3xl mb-12">Edit Your Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                USERNAME
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                TITLE
              </label>
              <Input
                type="text"
                value={userTitle}
                onChange={(e) => setUserTitle(e.target.value)}
                placeholder="e.g., Travel Writer, Nature Enthusiast"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] text-gray-600 mb-2 font-light">
                PROFILE IMAGE
              </label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="w-24 h-24 rounded-full overflow-hidden">
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
                    file:text-sm file:font-semibold
                    file:bg-gray-50 file:text-gray-700
                    hover:file:bg-gray-100"
                />
              </div>
            </div>

            <Button type="submit">UPDATE PROFILE</Button>

            {error && (
              <div className="text-red-500 text-xs text-center font-light">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-xs text-center font-light">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
