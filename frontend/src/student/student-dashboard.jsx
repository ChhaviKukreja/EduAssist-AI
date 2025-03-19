import React, { useState, useEffect } from 'react';
//import './student/student-dashboard.css';

// Main Dashboard Component
const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [focusMode, setFocusMode] = useState(false);
  
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  return (
    <div className={`dashboard-container ${focusMode ? 'focus-mode' : ''}`}>
      <nav className="sidebar">
        <div className="logo">
          <h2>StudyPal</h2>
        </div>
        <ul className="nav-links">
          <li className={activeSection === 'home' ? 'active' : ''} onClick={() => setActiveSection('home')}>
            <i className="fas fa-home"></i> Home
          </li>
          <li className={activeSection === 'assignments' ? 'active' : ''} onClick={() => setActiveSection('assignments')}>
            <i className="fas fa-tasks"></i> Assignments
          </li>
          <li className={activeSection === 'recommendations' ? 'active' : ''} onClick={() => setActiveSection('recommendations')}>
            <i className="fas fa-lightbulb"></i> Recommendations
          </li>
          <li className={activeSection === 'notes' ? 'active' : ''} onClick={() => setActiveSection('notes')}>
            <i className="fas fa-book"></i> Notes
          </li>
          <li className={activeSection === 'calendar' ? 'active' : ''} onClick={() => setActiveSection('calendar')}>
            <i className="fas fa-calendar"></i> Calendar
          </li>
          <li className={activeSection === 'chat' ? 'active' : ''} onClick={() => setActiveSection('chat')}>
            <i className="fas fa-comment"></i> Chat
          </li>
          <li className={activeSection === 'cheatsheets' ? 'active' : ''} onClick={() => setActiveSection('cheatsheets')}>
            <i className="fas fa-file-alt"></i> Cheat Sheets
          </li>
          <li className={activeSection === 'focus' ? 'active' : ''} onClick={() => setActiveSection('focus')}>
            <i className="fas fa-clock"></i> Focus Tools
          </li>
          <li className={activeSection === 'doubtai' ? 'active' : ''} onClick={() => setActiveSection('doubtai')}>
            <i className="fas fa-robot"></i> Doubt Solving
          </li>
        </ul>
        <div className="focus-toggle">
          <button onClick={toggleFocusMode}>
            {focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          </button>
        </div>
      </nav>

      <main className="content">
        {/* Home Section */}
        {activeSection === 'home' && (
          <section className="home-section">
            <h1>Welcome back, Student!</h1>
            <div className="overview-cards">
              <div className="card">
                <h3>Today's Tasks</h3>
                <p>3 assignments due</p>
              </div>
              <div className="card">
                <h3>Study Streak</h3>
                <p>5 days 🔥</p>
              </div>
              <div className="card">
                <h3>Focus Time</h3>
                <p>2h 30m this week</p>
              </div>
              <div className="card">
                <h3>Next Event</h3>
                <p>Math Exam - Tomorrow</p>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button onClick={() => setActiveSection('focus')}>Start Focus Session</button>
                <button onClick={() => setActiveSection('notes')}>Review Notes</button>
                <button onClick={() => setActiveSection('assignments')}>View Assignments</button>
                <button onClick={() => setActiveSection('calendar')}>Check Schedule</button>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <ul>
                <li>Completed assignment: "Data Structures Lab 3"</li>
                <li>Focused for 45 minutes on "Calculus Chapter 5"</li>
                <li>Added 3 new notes to "Physics Electromagnetism"</li>
              </ul>
            </div>
          </section>
        )}

        
       
      </main>
    </div>
  );
};

export default StudentDashboard;