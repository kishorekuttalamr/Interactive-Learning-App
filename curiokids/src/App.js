import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import api from "./api/apiClient"; // Import API client
import axios from "axios";
import LoginPage from "./loginPage";
import RegisterPage from "./Register";
import SelctSubjects from "./selectSubjects";
import VerifyOTP from "./verifyOtp";
import SaveUser from "./saveUser";
import Dashboard from "./dashboard";
import Forgotpwd from "./forgotpwd";
import Changepwd from "./changepwd";
import QuizApp from "./quizApp";
import Analysis from "./analysis";
import PersonalDetails from "./PersonalDetails";
import ViewScores from "./ViewScores";
import FriendRequest from "./sendFriendReq"

// Protected Route Component
const baseURL="http://localhost:5000";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify token using HTTP-only cookies (credentials: 'include')
        await axios.post(baseURL+"/verify-token",{}, {withCredentials:true});
        setIsAuthenticated(true);
      } catch (error) {
        try {
          // Attempt to refresh token
          console.log(error);
          await axios.post(baseURL+"/refresh-token", {}, { withCredentials: true });
          setIsAuthenticated(true);
        } catch (refreshError) {
          console.error("Authentication failed", refreshError);
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => {
    console.log("API client initialized");
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selectSubjects" element={<SelctSubjects />} />
        <Route path="/verifyOTP" element={<VerifyOTP />} />
        <Route path="/saveUser" element={<SaveUser />} />
        <Route path="/forgotpwd" element={<Forgotpwd />} />
        <Route path="/changepassword" element={<Changepwd />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/quiz" element={<ProtectedRoute element={<QuizApp />} />} />
        <Route path="/analysis" element={<ProtectedRoute element={<Analysis />} />} />
        <Route path="/personal-details" element={<ProtectedRoute element={<PersonalDetails />} />} />
        <Route path="/view-scores" element={<ProtectedRoute element={<ViewScores />} />} />
        <Route path="/find-friends" element={<ProtectedRoute element={<FriendRequest />} />} />
      </Routes>
    </Router>
  );
}

export default App;
