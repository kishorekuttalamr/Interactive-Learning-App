import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmailOrUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate API call to check if the email/username exists
    try {
      // Replace this with your actual API call
      const response = await fetch("http://localhost:5000/send-reset-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset instructions have been sent to your email.");
        setError("");
      } else {
        setError(data.message || "Invalid email or username.");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/cool shapes.png')",
        }}
      ></div>

      {/* Forgot Password Form */}
      <div className="relative p-10 w-[500px] rounded-lg shadow-xl 
                   backdrop-blur-xl border border-white/40 bg-white/15">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
          <h2 className="text-4xl font-poppins text-center mb-4 text-white">Forgot Password</h2>
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2 text-center">{success}</p>}
          <div className="mb-4">
            <label className="block text-[15px] font-poppins text-white">Email or Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full h-[50px] p-2 border rounded mt-1"
              placeholder="Enter your email or username"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-blue-600">
            Reset Password
          </button>
          {/* Back to Login Redirect */}
          <p className="text-white text-center mt-4">
            Remember your password? 
            <span
              className="text-blue-300 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}