import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "user@example.com" && password === "password123") {
      alert("Login successful!");
    } else {
      setError("Invalid email or password");
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

      {/* Login Form */}
      <div className="relative p-10 w-[500px] h-[500px] rounded-lg shadow-xl 
                   backdrop-blur-xl border border-white/40 bg-white/15">
        <form onSubmit={handleLogin} className="flex flex-col gap-y-8">
          <h2 className="text-4xl font-poppins text-center mb-4 text-white">Start Learning!</h2>
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block text-[15px] font-poppins text-white">Email /Username</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[50px] p-2 border rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[15px] font-poppins text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] p-2 border rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
          {/* Register Redirect */}
          <p className="text-white text-center mt-4">
            Don't have an account? 
            <span className="text-blue-300 cursor-pointer hover:underline" onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
