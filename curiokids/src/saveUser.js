import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SaveUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state;

    const [message, setMessage] = useState("Saving User Data...");
    const isSubmitting = useRef(false); // Prevent duplicate API calls

    useEffect(() => {
        if (userData && !isSubmitting.current) {
            console.log("🔄 useEffect triggered!");
            saveUserToBackend();
        }
    }, [userData]); // Only runs when `userData` changes

    const saveUserToBackend = async () => {
        if (isSubmitting.current) return; // Prevent duplicate calls
        isSubmitting.current = true;

        try {
            console.log(userData);
            const response = await fetch("http://localhost:5001/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("✅ User saved:", data);
                setMessage("User Registered Successfully! ✅");
                setTimeout(() => navigate("/dashboard"), 3000);
            } else {
                console.error("❌ Error saving user:", data.error);
                if (data.error === "Username or email already exists") {
                    setMessage("User already exists. Redirecting to registration... ⏳");
                    setTimeout(() => navigate("/register"), 3000);
                } else {
                    setMessage("Error saving user. Please try again.");
                }
            }
        } catch (error) {
            console.error("❌ Request failed:", error);
            setMessage("Server error. Please try again.");
        } finally {
            isSubmitting.current = false; // Reset flag after completion
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
                <h2 className="text-4xl font-poppins text-center text-white">{message}</h2>
            </div>
        </div>
    );
}
