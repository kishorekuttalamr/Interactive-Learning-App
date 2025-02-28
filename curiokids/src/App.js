import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./loginPage";
import RegisterPage from "./Register";
import SelctSubjects from "./selectSubjects"; // Ensure you have a RegisterPage component
import VerifyOTP from "./verifyOtp";
import SaveUser from "./saveUser";

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
      </Routes>
    </Router>
  );
}

export default App;
