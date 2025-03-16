import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and email from query params
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long, contain an uppercase letter, and a number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword: password }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess("Password successfully changed. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* FontAwesome CDN for Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* Background Image with Blur */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/cool shapes.png')" }}></div>

      {/* Change Password Form */}
      <div className="relative p-10 w-[500px] rounded-lg shadow-xl backdrop-blur-xl border border-white/40 bg-white/15">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          <h2 className="text-4xl font-poppins text-center mb-4 text-white">Change Password</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          {/* New Password */}
          <div className="relative">
            <label className="block text-[15px] font-poppins text-white">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] p-2 border rounded mt-1 pr-10"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-[15px] font-poppins text-white">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[50px] p-2 border rounded mt-1 pr-10"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
             >
              <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
            </button>
          </div>

          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-blue-600">
            Change Password
          </button>
          <p className="text-white text-center mt-4">
            Remember your password?
            <span className="text-blue-300 cursor-pointer hover:underline" onClick={() => navigate("/login")}>
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
