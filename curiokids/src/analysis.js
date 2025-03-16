import React from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Analysis = () => {
  const location = useLocation();
  const { questions, selectedAnswers, score } = location.state || {
    questions: [],
    selectedAnswers: [],
    score: 0,
  };

  // Calculate statistics
  const totalQuestions = questions.length;
  const correctAnswers = score;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  // Data for bar chart (question-wise performance)
  const barChartData = questions.map((q, index) => ({
    name: `Q${index + 1}`,
    correct: q.correct === selectedAnswers[index] ? 1 : 0,
    incorrect: q.correct !== selectedAnswers[index] ? 1 : 0,
  }));

  // Data for pie chart (overall performance)
  const pieChartData = [
    { name: "Correct", value: correctAnswers },
    { name: "Incorrect", value: incorrectAnswers },
  ];

  // Colors for pie chart
  const COLORS = ["#10B981", "#EF4444"];

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Analysis</h1>
      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg">
        {/* Overall Performance */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Overall Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-700 font-medium">
              Correct Answers: {correctAnswers}
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-700 font-medium">
              Incorrect Answers: {incorrectAnswers}
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-blue-700 font-medium">
              Total Questions: {totalQuestions}
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-yellow-700 font-medium">
              Percentage Score: {percentageScore}%
            </p>
          </div>
        </div>

        {/* Bar Chart - Question-wise Performance */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Question-wise Performance
        </h2>
        <div className="w-full h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="correct" fill="#10B981" name="Correct" />
              <Bar dataKey="incorrect" fill="#EF4444" name="Incorrect" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Overall Performance */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Overall Performance Distribution
        </h2>
        <div className="w-full h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Question Analysis */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Detailed Question Analysis
        </h2>
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="border-b-2 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Question {index + 1}: {q.question}
              </h3>
              <div className="mt-2">
                <p className="text-gray-700 font-medium">Options:</p>
                <ul className="list-disc list-inside">
                  {q.options.map((option, i) => (
                    <li
                      key={i}
                      className={`${
                        option === q.correct
                          ? "text-green-600"
                          : option === selectedAnswers[index]
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-green-600 font-medium mt-2">
                Correct Answer: {q.correct}
              </p>
              <p className="text-red-600 font-medium mt-2">
                Your Answer: {selectedAnswers[index] || "Not answered"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
