import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import UserTable from "../components/UserTable";

function UserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `/api/users/all?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) navigate("/login");
          return;
        }

        const data = await response.json();
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, [currentPage, user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) navigate("/login");
        return;
      }

      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
            ADMIN
          </div>
          <h1 className="font-serif text-3xl">User Management</h1>
        </div>

        {/* User Table */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <UserTable users={users} onDelete={handleDeleteUser} />

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-xs tracking-[0.2em] text-gray-600 hover:text-black disabled:text-gray-300 disabled:hover:text-gray-300 font-light transition-colors"
            >
              PREVIOUS
            </button>
            <span className="text-xs tracking-[0.2em] text-gray-600 font-light">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-xs tracking-[0.2em] text-gray-600 hover:text-black disabled:text-gray-300 disabled:hover:text-gray-300 font-light transition-colors"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
