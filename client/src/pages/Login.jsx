import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      login(userData);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex">
      <div className="w-1/2 bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
          alt="Magazine cover"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center p-16">
        <div className="w-full max-w-md">
          <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
            WELCOME BACK
          </div>
          <h2 className="font-serif text-3xl mb-12">Log in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="email"
              required
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              required
            />

            <Button type="submit">LOG IN</Button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <Link
              to="/sign-up"
              className="text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light"
            >
              CREATE ACCOUNT
            </Link>
            <div className="mt-2 mb-2 block text-xs tracking-[0.2em] text-gray-400 font-light">
              OR
            </div>
            <Link
              to="/forgot-password"
              className="text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light"
            >
              FORGOT PASSWORD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
