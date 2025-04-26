import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 비밀번호 재설정 이메일 보내는 로직 구현 예정
    console.log("Reset password email sent to:", email);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center">
      <div className="w-full max-w-md p-16">
        <div className="text-xs tracking-[0.2em] text-gray-500 mb-2 font-light">
          PASSWORD RECOVERY
        </div>
        <h2 className="font-serif text-3xl mb-6">Forgot your password?</h2>
        <p className="text-sm text-gray-600 font-light leading-relaxed mb-12">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <Button type="submit">SEND RESET LINK</Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-xs tracking-[0.2em] text-gray-600 hover:text-black font-light"
          >
            BACK TO LOG IN
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
