import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import your CSS file

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(false); 

  // Mock data for mandatory deadlines (from courses)
  const mandatoryDeadlines = [
    { date: "2025-04-15", subject: "Mathematics", task: "Assignment 1" },
    { date: "2025-04-21", subject: "Science", task: "Lab Report" },
    { date: "2025-04-25", subject: "History", task: "Research Paper" },
  ];

  // Mock data for user's selected subjects
  const subjects = ["Mathematics", "Science", "History", "Programming", "Literature"];
  const [name, setName] = useState("")
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const storedName = localStorage.getItem("name");
    if (storedName){
      setName(storedName)
    }
    return () => clearInterval(timer);
  }, []);


  // Toggle Dark Mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Handle logout
  const handleLogout = () => {
    navigate("/login");
  };

  // Handle subject dropdown click
  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject === selectedSubject ? null : subject);
  };

  // Handle click outside subject cards
  const handleClickOutside = (event) => {
    if (!event.target.closest(".subject-card")) {
      setSelectedSubject(null);
    }
  };

  // Attach click outside listener
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Calendar navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Handle date click
  const handleDateClick = (day) => {
    setSelectedDay(day);
  };

  // Handle task addition
  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
    const updatedTasks = { ...tasks, [dateKey]: [...(tasks[dateKey] || []), { text: newTask, completed: false, isMandatory: false }] };
    setTasks(updatedTasks);
    setNewTask("");
  };

  // Handle task completion
  const handleTaskCompletion = (dateKey, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[dateKey][index].completed = !updatedTasks[dateKey][index].completed;
    setTasks(updatedTasks);
  };

  // Get days in month
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  // Get first day of month
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    const calendar = [];
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="calendar-date empty"></div>);
    }
    for (let day = 1; day <= days; day++) {
      const dateKey = `${year}-${month + 1}-${day}`;
      const mandatoryTasks = mandatoryDeadlines.filter(
        (d) => new Date(d.date).getDate() === day
      );
      const userTasks = tasks[dateKey] || [];

      calendar.push(
        <div
          key={day}
          className={`calendar-date ${selectedDay === day ? "selected" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          <div className="tasks">
            {mandatoryTasks.map((task, index) => (
              <div key={`mandatory-${index}`} className="task mandatory">
                <span>📅 {task.task}</span>
              </div>
            ))}
            {userTasks.map((task, index) => (
              <div
                key={`user-${index}`}
                className={`task ${task.completed ? "completed" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskCompletion(dateKey, index);
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskCompletion(dateKey, index)}
                />
                <span>{task.text}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return calendar;
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        {/* Replace "Amirio University" with the logo */}
        <img src="./logo.png" alt="Logo" className="logo" /> {/* If logo is in public folder */}
        {/* <img src={logo} alt="Logo" className="logo" /> */} {/* If logo is in src/assets folder */}
        <div className="user-info">
          <span>Welcome, {name}</span>
          <span>{currentTime.toLocaleString()}</span>
        </div>
        <div className="notifications">
          <button onClick={() => setShowNotifications(!showNotifications)}>🔔</button>
          {showNotifications && (
            <div className="notification-dropdown">
              <p>No new notifications</p>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="collapse-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          {isSidebarCollapsed ? "➡" : "⬅"}
        </button>
        {/* <div className="profile">
          <img src="/profile.png" alt="Profile" />
          {!isSidebarCollapsed && <span>Kishore Kuttalam</span>}
        </div> */}
        <ul>
          <li onClick={() => navigate("/view-scores")}>
            <span>📊</span>
            {!isSidebarCollapsed && "View Scores"}
          </li>
          <li onClick={() => navigate("/personal-details")}>
            <span>👤</span>
            {!isSidebarCollapsed && "Personal Details"}
          </li>
        </ul>
      </div>

      {/* Main Area */}
      <div className="main-area">
        <h2>Your Subjects</h2>
        <div className="subject-grid">
          {subjects.map((subject, index) => (
            <div key={index} className="subject-card">
              <h3>{subject}</h3>
              <button onClick={() => handleSubjectClick(subject)}>
                {selectedSubject === subject ? "▲" : "▼"}
              </button>
              {selectedSubject === subject && (
                <div className="dropdown-options">
                  <button>See Feedback</button>
                  <button onClick={() => navigate("/quiz")}>Take Quiz</button>
                  <button onClick={() => setShowResourceModal(true)}>Access Resources</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Calendar and Motivation Section */}
        <div className="calendar-motivation-section">
          <div className="motivation">
            <h3>Motivational Quote</h3>
            <p>"Everything happens spontaneously when you distance yourself from your mind."</p>
          </div>
          <div className="calendar">
            <h3>Calendar</h3>
            <div className="calendar-navigation">
              <button onClick={handlePrevMonth}>⬅</button>
              <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button onClick={handleNextMonth}>➡</button>
            </div>
            <div className="calendar-grid">
              <div className="calendar-header">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              <div className="calendar-dates">{renderCalendar()}</div>
            </div>
            {selectedDay && (
              <div className="task-input">
                <input
                  type="text"
                  placeholder="Add a task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={handleAddTask}>Add</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Resources for {selectedSubject}</h3>
            <p>Here are the resources for your course.</p>
            <button onClick={() => setShowResourceModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}