import React, { useState } from 'react';
import { Bell, Calendar, Check, ChevronDown, ChevronUp, LineChart, List, MessageSquare, Monitor, Settings, User, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [todoExpanded, setTodoExpanded] = useState(true);
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Sample data
  const students = [
    { id: 1, name: 'Alex Johnson', grade: 'A', performance: 92, submitted: true, feedback: false },
    { id: 2, name: 'Jamie Smith', grade: 'B+', performance: 87, submitted: true, feedback: true },
    { id: 3, name: 'Taylor Brown', grade: 'C', performance: 74, submitted: true, feedback: false },
    { id: 4, name: 'Morgan Davis', grade: 'A-', performance: 90, submitted: true, feedback: true },
    { id: 5, name: 'Jordan Wilson', grade: '', performance: 0, submitted: false, feedback: false },
    { id: 6, name: 'Casey Miller', grade: 'B', performance: 83, submitted: true, feedback: false },
  ];
  
  const todoItems = [
    { id: 1, text: 'Grade History essays', completed: false, deadline: 'Today' },
    { id: 2, text: 'Prepare Math quiz', completed: true, deadline: 'Yesterday' },
    { id: 3, text: 'Schedule parent conferences', completed: false, deadline: 'Mar 20' },
    { id: 4, text: 'Submit quarterly reports', completed: false, deadline: 'Mar 25' },
  ];
  
  const calendarEvents = [
    { id: 1, title: 'Math Class - Room 101', time: '10:00 AM - 11:30 AM', today: true },
    { id: 2, title: 'Science Lab', time: '1:00 PM - 2:30 PM', today: true },
    { id: 3, title: 'Department Meeting', time: '3:30 PM - 4:30 PM', today: true },
    { id: 4, title: 'History Class - Room 203', time: '9:00 AM - 10:30 AM', today: false, date: 'Tomorrow' },
    { id: 5, title: 'Office Hours', time: '2:00 PM - 4:00 PM', today: false, date: 'Tomorrow' },
  ];
  
  const notifications = [
    { id: 1, text: 'Casey Miller submitted the Science assignment', time: '5 mins ago', read: false },
    { id: 2, text: 'Your meeting with the principal is scheduled for tomorrow', time: '1 hour ago', read: false },
    { id: 3, text: '3 students haven\'t submitted their Math homework', time: '3 hours ago', read: true },
  ];

  const announcements = [
    { id: 1, text: 'Remember to submit your projects by Friday!', time: 'Today, 9:15 AM' },
    { id: 2, text: 'Office hours canceled tomorrow. Available virtually.', time: 'Yesterday, 4:30 PM' },
  ];
  
  // Toggle todo item completion
  const toggleTodoItem = (id) => {
    console.log("Toggling todo item:", id);
  };
  
  const handleGradeClick = (student) => {
    setSelectedStudent(student);
    setShowFeedbackForm(true);
  };

  const handleAutoGradeClick = () => {
    navigate('/autograde');
  };
  
  // Render the main content area based on active tab
  const renderMainContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-100">Auto Grading & Feedback</h2>
                  <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleAutoGradeClick}>
                    Auto Grade New Submissions
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-2 text-left text-gray-300">Student</th>
                        <th className="px-4 py-2 text-left text-gray-300">Grade</th>
                        <th className="px-4 py-2 text-left text-gray-300">Performance</th>
                        <th className="px-4 py-2 text-left text-gray-300">Status</th>
                        <th className="px-4 py-2 text-left text-gray-300">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="px-4 py-3 text-gray-200">{student.name}</td>
                          <td className="px-4 py-3 text-gray-200">{student.submitted ? student.grade || 'Pending' : 'Not Submitted'}</td>
                          <td className="px-4 py-3">
                            {student.submitted ? (
                              <div className="flex items-center">
                                <div className="w-full bg-gray-600 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-500 h-2.5 rounded-full" 
                                    style={{ width: `${student.performance}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-gray-300">{student.performance}%</span>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            {student.submitted ? (
                              <span className="px-2 py-1 bg-green-800 text-green-200 rounded text-sm">
                                Submitted
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-800 text-red-200 rounded text-sm">
                                Missing
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {student.submitted && (
                              <button 
                                className={`px-3 py-1 rounded text-sm ${student.feedback ? 'bg-gray-700 text-gray-300' : 'bg-blue-800 text-blue-200'}`}
                                onClick={() => handleGradeClick(student)}
                              >
                                {student.feedback ? 'Edit Feedback' : 'Add Feedback'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-100">Performance Analysis</h2>
                  <select className="border border-gray-700 bg-gray-700 text-gray-200 rounded px-2 py-1">
                    <option>Last Assignment</option>
                    <option>Last Week</option>
                    <option>Last Month</option>
                    <option>This Semester</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-900/30 p-4 rounded">
                    <div className="text-3xl font-bold text-blue-400">85%</div>
                    <div className="text-sm text-blue-300">Average Performance</div>
                  </div>
                  <div className="bg-green-900/30 p-4 rounded">
                    <div className="text-3xl font-bold text-green-400">92%</div>
                    <div className="text-sm text-green-300">Submission Rate</div>
                  </div>
                  <div className="bg-purple-900/30 p-4 rounded">
                    <div className="text-3xl font-bold text-purple-400">78%</div>
                    <div className="text-sm text-purple-300">Engagement Score</div>
                  </div>
                </div>
                
                <div className="h-64 flex items-center justify-center bg-gray-900 rounded">
                  <div className="text-center text-gray-500">
                    <LineChart size={48} className="mx-auto mb-2 opacity-60 text-gray-600" />
                    <p className="text-gray-400">Performance trend visualization would appear here</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* To-Do List */}
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div 
                  className="px-6 py-4 bg-gray-700 flex justify-between items-center cursor-pointer"
                  onClick={() => setTodoExpanded(!todoExpanded)}
                >
                  <div className="flex items-center">
                    <List className="mr-2 text-gray-400" size={18} />
                    <h3 className="font-medium text-gray-200">To-Do List</h3>
                  </div>
                  {todoExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
                
                {todoExpanded && (
                  <div className="p-6">
                    <ul className="space-y-3">
                      {todoItems.map(item => (
                        <li key={item.id} className="flex items-start">
                          <div 
                            className={`flex-shrink-0 w-5 h-5 border rounded-full mt-1 flex items-center justify-center ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}
                            onClick={() => toggleTodoItem(item.id)}
                          >
                            {item.completed && <Check size={12} className="text-white" />}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                              {item.text}
                            </p>
                            <span className="text-xs text-gray-500">{item.deadline}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700 flex">
                      <input 
                        type="text" 
                        placeholder="Add new task..." 
                        className="flex-1 border-0 bg-transparent focus:ring-0 text-sm p-0 text-gray-300 placeholder-gray-500"
                      />
                      <button className="text-blue-600 font-medium text-sm">Add</button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Calendar */}
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div 
                  className="px-6 py-4 bg-gray-700 flex justify-between items-center cursor-pointer"
                  onClick={() => setCalendarExpanded(!calendarExpanded)}
                >
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-gray-400" size={18} />
                    <h3 className="font-medium text-gray-200">Calendar</h3>
                  </div>
                  {calendarExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
                
                {calendarExpanded && (
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-medium text-gray-200">March 14, 2025</h4>
                      <div className="flex space-x-2">
                        <button className="p-1 rounded hover:bg-gray-600 text-gray-400">
                          <ChevronUp size={16} />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-600 text-gray-400">
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Today</h5>
                        <ul className="space-y-2">
                          {calendarEvents.filter(event => event.today).map(event => (
                            <li key={event.id} className="bg-blue-900/30 p-3 rounded border-l-4 border-blue-500">
                              <div className="font-medium text-gray-200">{event.title}</div>
                              <div className="text-sm text-gray-400">{event.time}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Tomorrow</h5>
                        <ul className="space-y-2">
                          {calendarEvents.filter(event => !event.today).map(event => (
                            <li key={event.id} className="bg-gray-700 p-3 rounded">
                              <div className="font-medium text-gray-200">{event.title}</div>
                              <div className="text-sm text-gray-400">{event.time}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <button className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                      <Video size={16} className="mr-1" />
                      Schedule new meeting
                    </button>
                  </div>
                )}
              </div>
              
              {/* Announcements */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center text-gray-200">
                    <MessageSquare size={18} className="mr-2 text-gray-400" />
                    Announcements
                  </h3>
                  <button className="text-sm text-blue-600">View all</button>
                </div>
                
                <ul className="space-y-3">
                  {announcements.map(announcement => (
                    <li key={announcement.id} className="pb-3 border-b border-gray-700 last:border-0">
                      <p className="text-gray-200">{announcement.text}</p>
                      <span className="text-xs text-gray-500">{announcement.time}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-3 border-t border-gray-700 flex">
                  <input 
                    type="text" 
                    placeholder="Create new announcement..." 
                    className="flex-1 border-0 bg-transparent focus:ring-0 text-sm p-0 text-gray-300 placeholder-gray-500"
                  />
                  <button className="text-blue-600 font-medium text-sm">Post</button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'students':
        return (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">Student Performance Reports</h2>
            <div className="text-center text-gray-500 py-12">
              <LineChart size={48} className="mx-auto mb-2 opacity-60 text-gray-600" />
              <p className="text-gray-400">Detailed student performance reports would appear here</p>
            </div>
          </div>
        );
        
      case 'meetings':
        return (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">Video Meetings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-700 rounded-lg p-6 text-center">
                <Video size={48} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-medium mb-2 text-gray-200">Start Zoom Meeting</h3>
                <p className="text-gray-500 mb-4">Launch a new Zoom meeting for your class</p>
                <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                  Start Meeting
                </button>
              </div>
              
              <div className="border border-gray-700 rounded-lg p-6 text-center">
                <Monitor size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-medium mb-2 text-gray-200">Start Google Meet</h3>
                <p className="text-gray-500 mb-4">Launch a new Google Meet for your class</p>
                <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                  Start Meeting
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-4 text-gray-200">Upcoming Scheduled Meetings</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-300">Meeting Title</th>
                    <th className="px-4 py-2 text-left text-gray-300">Date & Time</th>
                    <th className="px-4 py-2 text-left text-gray-300">Platform</th>
                    <th className="px-4 py-2 text-left text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-3 text-gray-200">Math Class Review</td>
                    <td className="px-4 py-3 text-gray-200">Mar 15, 2025 - 10:00 AM</td>
                    <td className="px-4 py-3 text-gray-200">Zoom</td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 bg-blue-800 text-blue-200 rounded text-sm mr-2">
                        Start
                      </button>
                      <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-3 text-gray-200">Parent Conference</td>
                    <td className="px-4 py-3 text-gray-200">Mar 16, 2025 - 4:30 PM</td>
                    <td className="px-4 py-3 text-gray-200">Google Meet</td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 bg-blue-800 text-blue-200 rounded text-sm mr-2">
                        Start
                      </button>
                      <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-300">Select a tab from the sidebar</div>;
    }
  };
  
  // Render the feedback form modal
  const renderFeedbackForm = () => {
    if (!showFeedbackForm || !selectedStudent) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">
              Feedback for {selectedStudent.name}
            </h2>
            <button 
              className="text-gray-400 hover:text-gray-200"
              onClick={() => setShowFeedbackForm(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Grade
            </label>
            <div className="flex items-center">
              <select className="border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 w-24">
                <option>{selectedStudent.grade || 'Select'}</option>
                <option>A</option>
                <option>A-</option>
                <option>B+</option>
                <option>B</option>
                <option>B-</option>
                <option>C+</option>
                <option>C</option>
                <option>C-</option>
                <option>D</option>
                <option>F</option>
              </select>
              <div className="ml-4">
                <div className="w-full bg-gray-600 rounded-full h-2.5 w-64">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${selectedStudent.performance}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">{selectedStudent.performance}% Performance</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Personalized Feedback
            </label>
            <textarea 
              className="w-full border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 h-32"
              placeholder="Enter detailed feedback for the student..."
              defaultValue={selectedStudent.feedback ? "Great work on this assignment! Your analysis was thoughtful and showed good understanding of the concepts. Consider expanding on your conclusions in the next assignment." : ""}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Generate AI Feedback Suggestions
            </label>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                Positive reinforcement
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                Areas for improvement
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                Specific suggestions
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 border border-gray-700 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              onClick={() => setShowFeedbackForm(false)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
              onClick={() => setShowFeedbackForm(false)}
            >
              Save Feedback
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-gray-950 text-gray-300 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-gray-100">Teacher Dashboard</h1>
          ) : (
            <h1 className="text-xl font-bold text-gray-100">TD</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-200"
          >
            {sidebarOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-1">
            {[
              { id: 'overview', icon: <LineChart size={20} />, text: 'Overview' },
              { id: 'students', icon: <User size={20} />, text: 'Students' },
              { id: 'meetings', icon: <Video size={20} />, text: 'Meetings' },
              { id: 'settings', icon: <Settings size={20} />, text: 'Settings' }
            ].map(item => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full px-4 py-3 hover:bg-gray-800 ${activeTab === item.id ? 'bg-gray-800' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="text-gray-400">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.text}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-100">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'students' && 'Student Performance'}
              {activeTab === 'meetings' && 'Video Meetings'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="text-gray-400 hover:text-gray-200 relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-2xl border border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="font-medium text-gray-200">Notifications</h3>
                  </div>
                  <ul>
                    {notifications.map(notification => (
                      <li 
                        key={notification.id} 
                        className={`p-3 border-b border-gray-700 hover:bg-gray-700 ${!notification.read ? 'bg-blue-900/30' : ''}`}
                      >
                        <p className="text-sm text-gray-200">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-400">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                TD
              </div>
              {sidebarOpen && (
                <div className="ml-2">
                  <div className="text-sm font-medium">Teacher Demo</div>
                  <div className="text-xs text-gray-500">Science Department</div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderMainContent()}
        </main>
      </div>
      
      {/* Feedback form modal */}
      {renderFeedbackForm()}
    </div>
  );
};

export default TeacherDashboard;