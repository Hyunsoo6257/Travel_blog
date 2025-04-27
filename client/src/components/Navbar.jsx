import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const categories = ["all", "adventure", "culture", "food & cafe"];

  const menuItemClass =
    "block px-6 py-2 text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light transition-colors";

  return (
    <nav className="bg-[#F7F3EE] relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between border-b border-gray-200">
          {/* Logo */}
          <Link to="/" className="font-serif text-xl">
            MAGAZINE
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-10">
            {/* Categories */}
            {categories.map((category) => (
              <Link
                key={category}
                to={
                  category === "all"
                    ? "/"
                    : `/category/${category.replace(" & ", "-")}`
                }
                className="hidden md:block text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light transition-colors"
              >
                {category.toUpperCase()}
              </Link>
            ))}

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-gray-200"
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-serif text-gray-600">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 shadow-sm">
                    {/* User Info Section */}
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="font-serif text-sm mb-1">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-500 font-light">
                        {user.email}
                      </div>
                    </div>

                    <div className="py-3 divide-y divide-gray-100">
                      <div className="pb-3">
                        <Link to="/create-article" className={menuItemClass}>
                          WRITE
                        </Link>
                      </div>
                      <div className="py-3">
                        <Link to="/profile" className={menuItemClass}>
                          PROFILE
                        </Link>
                        <Link to="/my-articles" className={menuItemClass}>
                          MY ARTICLES
                        </Link>
                        <Link to="/saved-articles" className={menuItemClass}>
                          SAVED ARTICLES
                        </Link>
                        {user.isAdmin && (
                          <Link to="/admin/users" className={menuItemClass}>
                            MANAGE USERS
                          </Link>
                        )}
                      </div>
                      <div className="pt-3">
                        <button
                          onClick={logout}
                          className={`${menuItemClass} w-full text-left`}
                        >
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light transition-colors"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
