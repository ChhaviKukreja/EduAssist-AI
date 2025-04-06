import React, { useState, useEffect } from 'react';
import Assignments from './assignmentTest';
import config from './config';
import { Calendar, Clock, Award, FileText, CheckCircle, Book, Activity, ChevronRight } from 'lucide-react';

// Simplified Home component focusing solely on assignments
const Home = ({ navigateToAssignments, assignmentStats }) => {
  return (
    <section className="home-section p-6 md:p-8 lg:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back!
          </h1>
          <p className="text-blue-300">Let's continue your academic journey</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 bg-indigo-900/40 rounded-lg px-4 py-2">
          <Clock size={18} className="text-indigo-300 mr-2" />
          <span className="text-indigo-200">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
      
      {/* Assignment Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-5 border border-blue-800/30 shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-blue-900/20 hover:shadow-xl group">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-blue-800/30 text-blue-300 mr-3 group-hover:bg-blue-700/40 transition-all">
              <FileText size={24} />
            </div>
            <h3 className="text-gray-300 font-medium">Pending Assignments</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{assignmentStats.pending || 0}</p>
          <div className="flex items-center text-blue-400 text-sm mt-2 cursor-pointer" onClick={() => navigateToAssignments('assigned')}>
            <span>View details</span>
            <ChevronRight size={16} className="ml-1" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-5 border border-green-800/30 shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-green-900/20 hover:shadow-xl group">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-green-800/30 text-green-300 mr-3 group-hover:bg-green-700/40 transition-all">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-gray-300 font-medium">Submitted</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{assignmentStats.submitted || 0}</p>
          <div className="flex items-center text-green-400 text-sm mt-2 cursor-pointer" onClick={() => navigateToAssignments('submitted')}>
            <span>View submissions</span>
            <ChevronRight size={16} className="ml-1" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-xl p-5 border border-yellow-800/30 shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-yellow-900/20 hover:shadow-xl group">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-yellow-800/30 text-yellow-300 mr-3 group-hover:bg-yellow-700/40 transition-all">
              <Award size={24} />
            </div>
            <h3 className="text-gray-300 font-medium">Graded</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{assignmentStats.graded || 0}</p>
          <div className="flex items-center text-yellow-400 text-sm mt-2 cursor-pointer" onClick={() => navigateToAssignments('graded')}>
            <span>View grades</span>
            <ChevronRight size={16} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Assignment Due Soon */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="text-red-400 mr-2" size={20} />
            <h2 className="text-xl font-bold text-white">Due Soon</h2>
          </div>
          <button 
            onClick={navigateToAssignments}
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            View All <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        {assignmentStats.upcomingAssignments && assignmentStats.upcomingAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignmentStats.upcomingAssignments.map((assignment, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 shadow-lg hover:bg-gray-750/70 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-white text-lg">{assignment.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${assignment.daysLeft <= 2 ? 'bg-red-900/30 text-red-300 border border-red-700/30' : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'}`}>
                    {assignment.daysLeft} days left
                  </span>
                </div>
                <p className="text-gray-400 mt-2">{assignment.description}</p>
                <div className="flex justify-end mt-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">Start working</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/50">
            <div className="flex flex-col items-center">
              <Calendar size={40} className="text-gray-500 mb-3" />
              <p className="text-gray-400">No upcoming assignments</p>
              <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div className="mb-10">
        <div className="flex items-center mb-6">
          <Activity className="text-purple-400 mr-2" size={20} />
          <h2 className="text-xl font-bold text-white">Quick Access</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={navigateToAssignments}
            className="flex items-center px-5 py-3 rounded-xl bg-blue-600/80 text-white hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-900/30 hover:shadow-xl"
          >
            <FileText size={18} className="mr-2" />
            <span>All Assignments</span>
          </button>
          <button
            onClick={() => navigateToAssignments('submitted')}
            className="flex items-center px-5 py-3 rounded-xl bg-green-600/80 text-white hover:bg-green-500 transition-all duration-300 shadow-lg hover:shadow-green-900/30 hover:shadow-xl"
          >
            <CheckCircle size={18} className="mr-2" />
            <span>My Submissions</span>
          </button>
          <button
            onClick={() => navigateToAssignments('graded')}
            className="flex items-center px-5 py-3 rounded-xl bg-yellow-600/80 text-white hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-900/30 hover:shadow-xl"
          >
            <Award size={18} className="mr-2" />
            <span>Graded Work</span>
          </button>
        </div>
      </div>

      {/* Recent Submissions */}
      {assignmentStats.recentSubmissions && assignmentStats.recentSubmissions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Book className="text-green-400 mr-2" size={20} />
              <h2 className="text-xl font-bold text-white">Recent Submissions</h2>
            </div>
            <button 
              onClick={() => navigateToAssignments('submitted')}
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignmentStats.recentSubmissions.map((submission, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-750/70 hover:border-gray-600/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="p-3 rounded-lg bg-red-900/30 text-red-400 mr-3">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{submission.title}</h3>
                  <p className="text-gray-400 text-sm">Submitted on {submission.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

// Main Dashboard Component
const StudentDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('assigned');
  const [studentUsername, setStudentUsername] = useState('');
  const [assignedAssignments, setAssignedAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [gradedAssignments, setGradedAssignments] = useState([]);
  const [assignmentStats, setAssignmentStats] = useState({
    pending: 0,
    submitted: 0,
    graded: 0,
    upcomingAssignments: [],
    recentSubmissions: []
  });

  // Fetch student username
  useEffect(() => {
    const fetchStudentUsername = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/student/auth/check`, {
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
        setStudentUsername(data.username);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    fetchStudentUsername();
  }, []);

  // Fetch assignments data
  useEffect(() => {
    if (studentUsername) {
      fetchAssignmentData();
    }
  }, [studentUsername]);

  const fetchAssignmentData = async () => {
    try {
      // Fetch assigned assignments
      const assignedRes = await fetch(`${config.API_BASE_URL}/student/assignments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!assignedRes.ok) throw new Error("Failed to fetch assignments");
      const assignedData = await assignedRes.json();
      setAssignedAssignments(assignedData);

      // Fetch submitted assignments
      const submittedRes = await fetch(`${config.API_BASE_URL}/student/submissions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!submittedRes.ok) throw new Error("Failed to fetch submissions");
      const submittedData = await submittedRes.json();
      setSubmittedAssignments(submittedData);

      // For now, graded assignments is empty (as in your original code)
      setGradedAssignments([]);

      // Calculate assignment statistics for the dashboard
      updateAssignmentStats(assignedData, submittedData, []);

    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };

  // Calculate statistics for the dashboard
  const updateAssignmentStats = (assigned, submitted, graded) => {
    // Days remaining helper function
    const getDaysRemaining = (dateString) => {
      const dueDate = new Date(dateString);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    // Format date helper function
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get upcoming assignments (sorted by due date)
    const upcomingAssignments = assigned
      .map(a => ({
        title: a.title,
        description: a.description,
        daysLeft: getDaysRemaining(a.dueDate),
        dueDate: new Date(a.dueDate)
      }))
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 3); // Get only 3 most urgent assignments

    // Get recent submissions (sorted by submission date)
    const recentSubmissions = submitted
      .map(s => ({
        title: s.title,
        date: formatDate(s.submittedAt)
      }))
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 3); // Get only 3 most recent submissions

    // Update assignment stats
    setAssignmentStats({
      pending: assigned.length,
      submitted: submitted.length,
      graded: graded.length,
      upcomingAssignments,
      recentSubmissions
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navigateToAssignments = (tab = 'assigned') => {
    setActiveSection('assignments');
    setActiveTab(tab);
  };

  // Render appropriate section based on active section
  const renderSection = () => {
    switch (activeSection) {
      case 'assignments':
        // Pass activeTab to Assignments component
        return <Assignments initialTab={activeTab} />;
      case 'home':
      default:
        return <Home 
          navigateToAssignments={navigateToAssignments} 
          assignmentStats={assignmentStats}
        />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-100 to-white'} transition-colors duration-300`}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <nav className={`w-64 ${darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} 
        border-r transition-colors duration-300 shadow-lg backdrop-blur-sm`}>
          <div className="p-6 border-b border-gray-700/50 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center text-white font-bold">
              E
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              EduAssist
            </h2>
          </div>
          
          <ul className="p-4">
            {[
              { section: 'home', icon: 'home', label: 'Dashboard' },
              { section: 'assignments', icon: 'file-text', label: 'Assignments' }
            ].map((item) => (
              <li 
                key={item.section}
                className={`
                  px-4 py-3 mb-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center
                  ${activeSection === item.section 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/20' 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800/70' : 'text-gray-700 hover:bg-gray-200/70'}`}
                `}
                onClick={() => setActiveSection(item.section)}
              >
                {item.icon === 'home' && <div className="w-6 mr-3"><Activity size={20} /></div>} 
                {item.icon === 'file-text' && <div className="w-6 mr-3"><FileText size={20} /></div>}
                <span>{item.label}</span>
                {item.section === 'assignments' && assignmentStats.pending > 0 && (
                  <span className="ml-auto bg-blue-700/70 text-xs font-semibold px-2 py-1 rounded-full">
                    {assignmentStats.pending}
                  </span>
                )}
              </li>
            ))}
          </ul>
          
          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700/50">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-blue-900/20">
                {studentUsername ? studentUsername.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {studentUsername || 'Student'}
                </p>
                <p className="text-sm text-gray-400">Student</p>
              </div>
            </div>
            <button 
              onClick={toggleDarkMode} 
              className={`
                w-full flex items-center justify-center space-x-2 
                px-4 py-3 rounded-xl 
                ${darkMode 
                  ? 'bg-gray-800/50 text-white hover:bg-gray-700/50 border border-gray-700/50' 
                  : 'bg-gray-200/50 text-gray-800 hover:bg-gray-300/50 border border-gray-300/50'} 
                transition-all duration-300 backdrop-blur-sm
              `}
            >
              <span>{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`flex-1 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-b from-gray-100 to-white text-gray-800'} transition-colors duration-300`}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;