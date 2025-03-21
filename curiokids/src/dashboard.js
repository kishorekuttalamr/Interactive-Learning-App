import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Bell, LogOut, Home, Book, Users, ShoppingBag, Award, Calendar, Settings, Shield, Library } from "lucide-react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [streak, setStreak] = useState(5);
  const [showCalendar, setShowCalendar] = useState(false);

  const subjects = [
    { name: "Math", bg: "bg-red-500" },
    { name: "Science", bg: "bg-blue-500" },
    { name: "History", bg: "bg-yellow-500" },
    { name: "Programming", bg: "bg-green-500" },
    { name: "Literature", bg: "bg-purple-500" },
    { name: "Geography", bg: "bg-indigo-500" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 font-nunito">
      {/* Sidebar Navigation */}
      <div className="w-1/4 bg-white shadow-md p-6 flex flex-col items-center space-y-6 overflow-y-auto">
        <img src="/logo.png" alt="Logo" className="w-24 h-24 rounded-full" />
        <nav className="flex flex-col space-y-4 w-full text-sm">
          <button className="flex items-center space-x-3 text-green-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <Home size={18} /> <span>Learn</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <Book size={18} /> <span>Subjects</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <Users size={18} /> <span>Leaderboards</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <ShoppingBag size={18} /> <span>Shop</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <Award size={18} /> <span>Achievements</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200" onClick={() => setShowCalendar(!showCalendar)}>
            <Calendar size={18} /> <span>Calendar</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <Settings size={18} /> <span>Settings</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <Shield size={18} /> <span>Parental Control</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-600 font-bold w-full p-2 rounded-lg hover:bg-cyan-200">
            <Library size={18} /> <span>Resources</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center overflow-hidden">
        {/* Header */}
        <div className="w-full max-w-4xl flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Profile" className="w-16 h-16 rounded-full" />
            <div>
              <p className="text-xl font-bold">Welcome, Alex!</p>
              <p className="text-md text-gray-500">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-yellow-400 px-3 py-1 rounded-full text-yellow-900 font-bold text-lg">
              <Trophy size={20} />
              <span className="ml-2">{streak}</span>
            </div>
            <Bell size={24} className="text-gray-600 cursor-pointer" />
            <LogOut size={24} className="text-red-500 cursor-pointer" onClick={() => navigate("/login")} />
          </div>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <div className="w-full max-w-2xl bg-white p-4 mt-6 shadow-md rounded-lg">
            <h2 className="text-lg font-bold mb-3">Upcoming Events</h2>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "",
              }}
              height="300px"
              events={[
                { title: "Math Test", date: "2024-03-25" },
                { title: "Science Assignment Due", date: "2024-03-28" },
                { title: "History Quiz", date: "2024-04-01" },
              ]}
            />
          </div>
        )}

        {/* Subjects Tree */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className={`shadow-md p-6 rounded-lg flex flex-col items-center cursor-pointer transition ${hoveredSubject === subject.bg ? subject.bg + ' text-white' : 'bg-white text-gray-800'}`}
              onMouseEnter={() => setHoveredSubject(subject.bg)}
              onMouseLeave={() => setHoveredSubject(null)}
            >
              <p className="text-xl font-bold">{subject.name}</p>
              <button
                className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                onClick={() => navigate("/quiz")}
              >
                Take Quiz
              </button>
            </div>
          ))}
        </div>

        {/* Updates and Challenges Section */}
        <div className="w-full max-w-4xl bg-white shadow-md p-6 mt-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Updates and Challenges</h2>
          <div className="space-y-4">
            {/* Quest Progress */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Lucy's Secret Mission</h3>
              <p className="text-sm text-gray-600">Complete 20 quests</p>
              <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">13 / 20</p>
            </div>

            {/* Daily Quests */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Daily Quests</h3>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Earn 20 XP</p>
                  <p className="text-sm text-gray-600">0 / 20</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Spend 10 minutes learning</p>
                  <p className="text-sm text-gray-600">0 / 10</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Earn 15 Combo Bonus XP</p>
                  <p className="text-sm text-gray-600">0 / 15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}