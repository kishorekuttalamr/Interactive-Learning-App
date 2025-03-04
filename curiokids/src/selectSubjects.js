import { useState } from "react";
<<<<<<< Updated upstream
import { useLocation, useNavigate } from "react-router-dom";

export default function SubjectSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the state passed via navigation
  const formData = location.state?.formData || {};
  // console.log(formData);

=======
import { useNavigate } from "react-router-dom";

export default function SubjectSelectionPage() {
  const navigate = useNavigate();
>>>>>>> Stashed changes
  const subjects = [
    "Math", "Science", "English", "History", "Geography",
    "Computer Science", "Art", "Music", "Physics", "Biology"
  ];

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleNext = async () => {
    const userData = { ...formData, selectedSubjects };
        console.log(userData);
        navigate("/saveUser", { state: userData }); // Navigate to next page
      
  };
  

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/cool shapes.png')" }}
      ></div>

      {/* Selection Box */}
      <div className="relative p-10 w-[800px] rounded-lg shadow-xl backdrop-blur-xl border border-white/40 bg-white/10 mt-16">
        <h2 className="text-4xl font-poppins text-center mb-4 text-white">Select Your Subjects</h2>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={`p-3 rounded-lg text-white text-lg transition-all ${
                selectedSubjects.includes(subject) ? "bg-blue-500" : "bg-white/10 border border-white/40"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          className="mt-6 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Continue
        </button>
      </div>

      {/* Try Sample Quiz Button */}
      <button 
        onClick={() => navigate('/quiz')} 
        className="absolute bottom-5 right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600"
      >
        Try Sample Quiz
      </button>
    </div>
  );
}
