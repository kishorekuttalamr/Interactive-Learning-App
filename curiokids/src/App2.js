import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./loginPage";
import RegisterPage from "./Register";
import SelctSubjects from "./selectSubjects";
import VerifyOTP from "./verifyOtp";
import QuizApp from "./QuizApp"; // Import the QuizApp component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selectSubjects" element={<SelctSubjects />} />
        <Route path="/verifyOTP" element={<VerifyOTP />} />
        <Route path="/quiz" element={<QuizApp />} /> {/* Quiz Page Route */}
      </Routes>
    </Router>
  );
}

export default App;
