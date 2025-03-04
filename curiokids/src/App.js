

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./loginPage";
import RegisterPage from "./Register";
import SelctSubjects from "./selectSubjects";
import VerifyOTP from "./verifyOtp";
<<<<<<< Updated upstream
import SaveUser from "./saveUser";
=======
import QuizApp from "./QuizApp"; 
import Analysis from "./analysis"; 
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/selectSubjects" element={<SelctSubjects />} />
        <Route path="/verifyOTP" element={<VerifyOTP />} />
<<<<<<< Updated upstream
        <Route path="/saveUser" element={<SaveUser />} />
=======
        <Route path="/quiz" element={<QuizApp />} /> {/* Quiz Page Route */}
        {/* Analysis Page Route */}
        <Route path="/analysis" element={<Analysis />} />
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
