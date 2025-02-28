import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || null; // Get form data
  const email = location.state?.email || "";  // Get email from navigation state
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
  
    // Bypass verification for specific email
    if (formData.parentEmail === "arjun@shivakumar.in" && otp === "123456") {
      alert("OTP Verified! Registration Successful.");
      navigate("/selectSubjects", { state: { formData } });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.parentEmail, otp }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("OTP Verified! Registration Successful.");
        navigate("/selectSubjects", { state: { formData } });
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Failed to verify OTP. Check your internet connection.");
    }
  };
  

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/cool shapes.png')" }}
      ></div>

      <div className="relative p-10 w-[500px] rounded-lg shadow-xl 
                     backdrop-blur-xl border border-white/40 bg-white/10 mt-16">
        <h2 className="text-4xl font-poppins text-center text-white">Enter OTP</h2>
        <h5 className="text-sm font-light text-center mb-6 text-white">
          Sent to {email || "your email"}
        </h5>
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <input
          type="text"
          placeholder="6-digit OTP"
          onChange={(e) => setOtp(e.target.value)}
          className="input-style rounded h-[40px] p-2 w-full"
          required
        />
        <button
          onClick={handleVerifyOtp}
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
