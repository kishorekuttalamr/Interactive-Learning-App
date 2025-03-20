import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials:"include"
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data);
        document.cookie = `username=${data.username}; path=/; secure`;
        document.cookie = `usertype=${data.userType}; path=/; secure`;  
        document.cookie = `name=${data.name}; path=/; secure`;
        document.cookie = `selectedSubjects=${data.selectedSubjects}; path=/; secure`;
        document.cookie = `userId=${data.userId}; path=/; secure`;
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/cool shapes.png')" }}
      ></div>

      <div className="relative p-10 w-[500px] h-[570px] rounded-lg shadow-xl 
                   backdrop-blur-xl border border-white/40 bg-white/15">
        <form onSubmit={handleLogin} className="flex flex-col gap-y-8">
          <h2 className="text-4xl font-poppins text-center mb-4 text-white">Start Learning!</h2>
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block text-[15px] font-poppins text-white">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-[50px] p-2 border rounded mt-1"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-[15px] font-poppins text-white">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[50px] p-2 border rounded mt-1 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>

          <p className="text-white text-center mt-4">
            Don't have an account? 
            <span className="text-blue-300 cursor-pointer hover:underline" onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>

          <p className="text-white text-center">
            Forgot Password? 
            <span className="text-blue-300 cursor-pointer hover:underline" onClick={() => navigate("/forgotpwd")}>
              Change here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}