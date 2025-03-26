import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import Assignments from './assignmentTest';
import Calendar from './calendar';
import Chat from './chatMessage';
import Cheatsheets from './cheatSheets';
import DoubtAI from './doubtSolving';
import Focus from './focusTools';
import Notes from './notes';
import Recommendations from './recommendation';


// Dummy Home component if you haven't imported one
const Home = ({ darkMode, toggleDarkMode }) => {
  return (
    <section className="home-section dark">
      <h1 className="text-white transition-colors duration-300">
        Welcome back, Student!
      </h1>
      <div className="overview-cards">
        {[
          { title: "Today's Tasks", detail: "3 assignments due" },
          { title: "Study Streak", detail: "5 days 🔥" },
          { title: "Focus Time", detail: "2h 30m this week" },
          { title: "Next Event", detail: "Math Exam - Tomorrow" }
        ].map((card, index) => (
          <div
            key={index}
            className="card bg-gray-800 text-gray-200 border border-gray-700 transition-all duration-300"
          >
            <h3 className="text-gray-300">{card.title}</h3>
            <p>{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2 className="text-white transition-colors duration-300">
          Quick Actions
        </h2>
        <div className="action-buttons space-x-4">
          <button
            onClick={toggleDarkMode}
            className="
              flex items-center justify-center space-x-2 px-4 py-2 rounded-md 
              bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300
            "
          >
            <span>☀</span>
            <span>Light Mode</span>
          </button>
          {['Review Notes', 'View Assignments', 'Check Schedule'].map((action, index) => (
            <button
              key={index}
              onClick={() => console.log(action)}
              className="
                px-4 py-2 rounded-md 
                bg-gray-700 text-gray-200 hover:bg-gray-600 
                transition-all duration-300
              "
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="recent-activity bg-gray-800 p-4 rounded-md mt-4">
      <h1 className="text-white transition-colors duration-300">
          Recent Activity
        </h1>
        <br></br>
        {[
          { text: 'Completed assignment: "Data Structures Lab 3"' },
          { text: 'Focused for 45 minutes on "Calculus Chapter 5"' },
          { text: 'Added 3 new notes to "Physics Electromagnetism"' }
        ].map((activity, index) => (
          <div 
            key={index} 
            className="text-gray-300 py-2 border-b border-gray-700 last:border-b-0"
          >
            {activity.text}
          </div>
          ))}
      </div>
    </section>
  );
};

// Main Dashboard Component
const StudentDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [focusMode, setFocusMode] = useState(false);
  const [studentUsername, setStudentUsername] = useState();

  useEffect(() => {
    const fetchStudentUsername = async () => {
      try {
        const res = await fetch('http://localhost:5000/student/auth/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to authenticate');
        }

        const data = await res.json();
        console.log("data", data.username);
        setStudentUsername(data.username);
        console.log('Authenticated username:', data.username);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    fetchStudentUsername();
  }, []);

  let studentId = studentUsername;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'assignments':
        return <Assignments />;
      case 'recommendations':
        return <Recommendations />;
      case 'notes':
        return <Notes />;
      case 'calendar':
        return <Calendar />;
      case 'chat':
        return <Chat />;
      case 'cheatsheets':
        return <Cheatsheets />;
      case 'focus':
        return <Focus />;
      case 'doubtai':
        return <DoubtAI />;
      case 'home':
      default:
        return <Home darkMode={true} toggleDarkMode={toggleDarkMode} />;
    }
  };

  return (
    <div className="dashboard-container dark bg-gray-900 transition-colors duration-300">
      <nav className="
        sidebar 
        bg-gray-800 text-white border-r border-gray-700 
        transition-colors duration-300
      ">
        <div className="logo">
          <h2 className="text-white transition-colors duration-300">
            StudyPal
          </h2>
        </div>
        <ul className="nav-links">
          {[
            { section: 'home', icon: 'fas fa-home', label: 'Home' },
            { section: 'assignments', icon: 'fas fa-tasks', label: 'Assignments' },
            { section: 'recommendations', icon: 'fas fa-lightbulb', label: 'Recommendations' },
            { section: 'notes', icon: 'fas fa-book', label: 'Notes' },
            { section: 'calendar', icon: 'fas fa-calendar', label: 'Calendar' },
            { section: 'chat', icon: 'fas fa-comment', label: 'Chat' },
            { section: 'cheatsheets', icon: 'fas fa-file-alt', label: 'Cheat Sheets' },
            { section: 'focus', icon: 'fas fa-clock', label: 'Focus Tools' },
            { section: 'doubtai', icon: 'fas fa-robot', label: 'Doubt Solving' }
          ].map((item) => (
            <li 
              key={item.section}
              className={`
                cursor-pointer transition-all duration-300 
                ${activeSection === item.section ? 'bg-gray-700 text-white' : ''}
                hover:bg-gray-700
              `}
              onClick={() => setActiveSection(item.section)}
            >
              <i className={`${item.icon} mr-2`}></i> {item.label}
            </li>
          ))}
        </ul>
        <div className="focus-toggle p-4">
          <button 
            onClick={toggleDarkMode} 
            className="
              w-full flex items-center justify-center space-x-2 
              px-4 py-2 rounded-md 
              bg-gray-700 text-white hover:bg-gray-600 
              transition-all duration-300
            "
          >
            <span>☀</span>
            <span>Light Mode</span>
          </button>
        </div>
      </nav>

      <main className="
        content 
        bg-gray-900 text-white 
        transition-colors duration-300
      ">
        {renderSection()}
      </main>
    </div>
  );
};

export default StudentDashboard;
