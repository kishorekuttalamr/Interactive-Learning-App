import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SaveUser() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve passed user data or use default values
    const userData = location.state || {
        name: "Test User",
        email: "testuser@example.com",
        selectedSubjects: ["Math", "Science", "History"]
    };

    console.log("saveuser");
    console.log("User Data:", userData);

    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        
        if (userData) {
            console.log("🔄 useEffect triggered! userData:", userData);

            saveUserToBackend();

        }
    }, [userData]); // Trigger effect only when `userData` changes

    const saveUserToBackend = async () => {
        try {
            const response = await fetch("http://localhost:5001/saveUserbackend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData), // Send `userData` directly
            });
            const data = await response.json();
            if (response.ok) {
                console.log("✅ User saved:", data);
                setIsRegistered(true);
                setTimeout(() => navigate("/dashboard"), 3000); // Redirect after 3 sec
            } else {
                console.error("❌ Error saving user:", data.error);
            }
        } catch (error) {
            console.error("❌ Request failed:", error);
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
                {isRegistered ? (
                    <h2 className="text-4xl font-poppins text-center text-white">User Registered Successfully! ✅</h2>
                ) : (
                    <h2 className="text-4xl font-poppins text-center text-white">Saving User Data...</h2>
                )}
            </div>
        </div>
    );
}
