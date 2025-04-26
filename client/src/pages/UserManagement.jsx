import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl font-semibold text-gray-900">Users</h1>
        <div className="mt-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Username
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {user.username}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {user.isAdmin ? "Admin" : "User"}
                  </td>
                  <td className="text-right px-3 py-4 text-sm">
                    {!user.isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border rounded"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
