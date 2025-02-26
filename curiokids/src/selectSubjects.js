import { useState } from "react";

export default function SubjectSelectionPage() {
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

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/cool shapes.png')" }}
      ></div>

      {/* Top Bar with Logo */}
      {/* <div className="absolute top-0 left-0 w-full bg-gray-900 bg-opacity-80 p-4 flex items-center justify-between shadow-md z-10">
        <img src="/logo.png" alt="Logo" className="h-10 ml-4" />
      </div> */}

      {/* Selection Box */}
      <div className="relative p-10 w-[800px] rounded-lg shadow-xl backdrop-blur-xl border border-white/40 bg-white/10 mt-16">
        <h2 className="text-4xl font-poppins text-center mb-4 text-white">Select Your Subjects</h2>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={`p-3 rounded-lg text-white text-lg transition-all ${selectedSubjects.includes(subject) ? "bg-blue-500" : "bg-white/10 border border-white/40"}`}
            >
              {subject}
            </button>
          ))}
        </div>
        <button className="mt-6 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Continue
        </button>
      </div>
    </div>
  );
}
