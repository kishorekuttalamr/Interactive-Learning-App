import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import he from "he"; // Import he for decoding HTML entities
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const QuizApp = () => {
  const [questions, setQuestions] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Track selected answers
  const [timeLeft, setTimeLeft] = useState(60); // 1-minute timer
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=19&type=multiple") // Fetch 10 questions
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setQuestions(
            data.results.map((q) => ({
              question: he.decode(q.question),
              options: [...q.incorrect_answers, q.correct_answer]
                .map(he.decode)
                .sort(() => Math.random() - 0.5),
              correct: he.decode(q.correct_answer),
            }))
          );
        }
      })
      .catch(() => setQuestions([]));
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      // Automatically submit the quiz when time runs out
      setShowScore(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer
  }, [timeLeft]);

  const handleAnswerClick = (answer) => {
    // Track the selected answer
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentQuestion] = answer;
    setSelectedAnswers(updatedSelectedAnswers);

    // Update score if the answer is correct
    if (questions && answer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    // Move to the next question or show the score
    const nextQuestion = currentQuestion + 1;
    if (questions && nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleGoToAnalysis = () => {
    // Pass questions, selected answers, and score to the Analysis page
    navigate("/analysis", { state: { questions, selectedAnswers, score } });
  };

  // Calculate the number of questions attended
  const questionsAttended = selectedAnswers.filter((answer) => answer !== undefined).length;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-5 relative text-gray-900"
      style={{
        backgroundImage: "url('/bgm1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Timer */}
      <div className="absolute top-4 left-4 text-lg font-bold bg-red-500 text-white px-4 py-2 rounded-md shadow-md">
        Time Left: {timeLeft}s
      </div>

      {/* Score */}
      <div className="absolute top-4 right-4 text-lg font-bold bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
        Score: {score}
      </div>

      {/* Number of Questions Attended */}
      <div className="absolute top-16 left-4 text-lg font-bold bg-blue-500 text-white px-4 py-2 rounded-md shadow-md">
        Attended: {questionsAttended} / {questions ? questions.length : 0}
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-6 text-center bg-white shadow-xl rounded-xl border-2 border-blue-500 bg-opacity-90"
      >
        {!questions ? (
          <h2 className="text-xl font-bold text-gray-900">Loading Questions...</h2>
        ) : questions.length === 0 ? (
          <h2 className="text-xl font-bold text-red-500">Failed to Load Questions</h2>
        ) : showScore ? (
          <>
            <h2 className="text-xl font-bold text-gray-900">
              You scored {score} out of {questions.length}!
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition-all duration-200"
              onClick={handleGoToAnalysis}
            >
              Get Test Analysis
            </motion.button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-2 mb-4">
              {questions[currentQuestion].question}
            </h2>

            <div className="mt-4 grid gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-white hover:bg-yellow-400 p-3 rounded-md border border-blue-400 text-lg transition-all duration-200 text-gray-900 shadow-sm ${
                    selectedAnswers[currentQuestion] === option ? "bg-yellow-400" : ""
                  }`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default QuizApp;