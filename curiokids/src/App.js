import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./loginPage";
import RegisterPage from "./Register";
import SelctSubjects from "./selectSubjects";
import VerifyOTP from "./verifyOtp";
import SaveUser from "./saveUser";
import Dashboard from "./dashboard"; // Import the Dashboard component
import Forgotpwd from "./forgotpwd";
import Changepwd from "./changepwd";
import QuizApp from "./quizApp"; // Import the QuizApp component
import Analysis from "./analysis"; // Import the Analysis component
import PersonalDetails from "./PersonalDetails";
import ViewScores from "./ViewScores";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selectSubjects" element={<SelctSubjects />} />
        <Route path="/verifyOTP" element={<VerifyOTP />} />
        <Route path="/saveUser" element={<SaveUser />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
        <Route path="/forgotpwd" element={<Forgotpwd />}/>
        <Route path="/changepassword" element={<Changepwd />}/>
        {/* Quiz Page Route */}
        <Route path="/quiz" element={<QuizApp />} />

        {/* Analysis Page Route */}
        <Route path="/analysis" element={<Analysis/>}/>
        <Route path="/personal-details" element={<PersonalDetails/>}/>
        <Route path="/view-scores" element={<ViewScores/>}/>
      </Routes>
    </Router>
  );
}

export default App;