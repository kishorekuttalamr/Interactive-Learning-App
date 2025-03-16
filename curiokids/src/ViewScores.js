import React from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ViewScores() {
  const navigate = useNavigate();

  // Mock data for scores
  const scores = [
    { subject: "Mathematics", score: 85 },
    { subject: "Science", score: 90 },
    { subject: "History", score: 78 },
    { subject: "Programming", score: 92 },
    { subject: "Literature", score: 88 },
  ];

  // Data for the bar chart
  const chartData = {
    labels: scores.map((s) => s.subject),
    datasets: [
      {
        label: "Scores",
        data: scores.map((s) => s.score),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="view-scores-container">
      <h2>View Scores</h2>
      <div className="scores-section">
        {/* Bar Chart */}
        <div className="chart-container">
          <Bar data={chartData} />
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{score.subject}</td>
                  <td>{score.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}
