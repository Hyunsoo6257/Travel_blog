import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login"); // Redirect to login on success
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex">
      {/* Left side - Form */}
      <div className="w-1/2 flex items-center justify-center p-16">
        <div className="w-full max-w-md">
          <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
            JOIN US
          </div>
          <h2 className="font-serif text-3xl mb-12">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <Button type="submit">CREATE ACCOUNT</Button>

            {error && (
              <div className="text-red-500 text-xs text-center font-light">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light"
            >
              BACK TO SIGN IN
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
          alt="Magazine cover"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
    </div>
  );
}

export default SignUp;
