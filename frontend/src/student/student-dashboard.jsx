import React, { useState, useEffect } from 'react';
//import './student/student-dashboard.css';

// Main Dashboard Component
const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [focusMode, setFocusMode] = useState(false);
  const [studyTimer, setStudyTimer] = useState(25 * 60); // 25 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [notes, setNotes] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [studentUsername, setStudentUsername] = useState(null);
  const [teacherAssignments, setTeacherAssignments] = useState([]);

  useEffect(() => {
    const fetchStudentUsername = async () => {
      try {
        const res = await fetch('http://localhost:5000/student/auth/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + localStorage.getItem('token') // Or however you're storing the token
          }
        });
  
        if (!res.ok) {
          throw new Error('Failed to authenticate');
        }
  
        const data = await res.json();
        setStudentUsername(data.email);
        console.log('Authenticated username:', data.email);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
  
    fetchStudentUsername();
  }, []);

  useEffect(() => {
    const fetchTeacherAssignments = async () => {
      console.log("outside try");
      try {
        console.log("inside try");
        const res = await fetch('http://localhost:5000/teacher/assignments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            // Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
  
        if (!res.ok) {
          throw new Error('Failed to fetch assignments');
        }
  
        const data = await res.json();
        console.log("data", data)
        setTeacherAssignments(data); // Adjust this based on your backend response structure
      } catch (error) {
        console.error('Error fetching teacher assignments:', error);
      }
    };
  
    fetchTeacherAssignments();
  }, []);
  

  useEffect(() => {
    let interval;
  
    if (timerRunning && studyTimer > 0) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev - 1);
      }, 1000);
    } else if (studyTimer === 0) {
      setTimerRunning(false);
      alert("Time's up! Take a break.");
    }
  
    const fetchSubmissions = async () => {
      if (!studentUsername) return; // Wait until you have the username
      try {
        const res = await fetch(`http:localhost:5000/student/submissions?studentId=${studentUsername}`);
        const data = await res.json();
        setAssignmentSubmissions(data.submissions);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      }
    };
  
    if (activeSection === 'assignments') {
      fetchSubmissions();
    }
  
    return () => clearInterval(interval);
  
  }, [timerRunning, studyTimer, activeSection, studentUsername]);
  
  

  // Sample recommended content
  const recommendedContent = [
    { title: "Advanced Calculus Concepts", type: "Video", duration: "15 min" },
    { title: "Data Structures Fundamentals", type: "Article", duration: "8 min" },
    { title: "Programming Paradigms", type: "Quiz", duration: "10 min" },
    { title: "Machine Learning Basics", type: "Interactive", duration: "20 min" }
  ];

  // Sample auto-summarized notes
  const autoSummarizedNotes = [
    { title: "Physics Lecture 8", summary: "Newton's laws of motion and practical applications in everyday scenarios. Key equations covered: F=ma, action-reaction pairs." },
    { title: "Data Science Basics", summary: "Introduction to data cleaning, exploratory analysis, and visualization techniques using Python libraries." }
  ];

  // Sample formulas and cheat sheets
  const cheatSheets = [
    { title: "Calculus Formulas", content: "Integration by parts: ∫u dv = uv - ∫v du\nChain rule: d/dx[f(g(x))] = f'(g(x))·g'(x)" },
    { title: "Physics Constants", content: "Gravitational constant (G): 6.674×10^−11 m^3⋅kg^−1⋅s^−2\nSpeed of light (c): 299,792,458 m/s" },
    { title: "SQL Commands", content: "SELECT column FROM table WHERE condition;\nCREATE TABLE table_name (column1 datatype, column2 datatype);" }
  ];

  // Sample calendar events
  const calendarEvents = [
    { title: "Math Exam", date: "2025-03-20", time: "10:00 AM", location: "Room 305" },
    { title: "Group Project Meeting", date: "2025-03-18", time: "2:30 PM", location: "Library" },
    { title: "Programming Assignment Due", date: "2025-03-22", time: "11:59 PM", location: "Online" }
  ];

  // Relaxation exercises
  const relaxationExercises = [
    { title: "Box Breathing", description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 5 times." },
    { title: "Progressive Muscle Relaxation", description: "Tense and then relax each muscle group in your body, starting from your toes and working up to your head." },
    { title: "Mindfulness Meditation", description: "Focus on your breath, acknowledging thoughts as they come but letting them pass without judgment." }
  ];

  // Format time for timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle chat message sending
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { text: newMessage, sender: 'user', time: new Date().toLocaleTimeString() }]);
      
      // Simulate response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "I received your message. How can I help you with this topic?", 
          sender: 'assistant', 
          time: new Date().toLocaleTimeString() 
        }]);
      }, 1000);
      
      setNewMessage('');
    }
  };

  // Handle task addition
  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  // Handle AI doubt solving
  const handleAskQuestion = () => {
    if (currentQuestion.trim()) {
      setIsLoading(true);
      // Simulate AI response
      setTimeout(() => {
        setAiResponse("Based on your question, I think you're asking about [topic]. Here's an explanation: [detailed answer would appear here with relevant information and examples].");
        setIsLoading(false);
      }, 2000);
    }
  };

  // Start/stop timer
  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  // Reset timer
  const resetTimer = () => {
    setTimerRunning(false);
    setStudyTimer(25 * 60);
  };

  // Toggle focus mode
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  // Handle file selection for assignment submission
  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  // Handle assignment submission
  const handleAssignmentSubmit = (assignmentId) => {
    if (!fileToUpload) {
      alert("Please select a file to upload");
      return;
    }

    setUploadingFile(true);

    // Simulate file upload
    setTimeout(() => {
      // Update assignment status
      const updatedAssignments = teacherAssignments.map(assignment => {
        if (assignment.id === assignmentId) {
          return { ...assignment, submitted: true };
        }
        return assignment;
      });
      setTeacherAssignments(updatedAssignments);

      // Add to submissions
      const submittedAssignment = teacherAssignments.find(a => a.id === assignmentId);
      const newSubmission = {
        id: assignmentSubmissions.length + 1,
        assignmentId: assignmentId,
        assignmentTitle: submittedAssignment.title,
        submittedDate: new Date().toLocaleDateString(),
        fileName: fileToUpload.name,
        fileSize: Math.round(fileToUpload.size / 1024) + " KB",
        status: "Submitted"
      };
      
      setAssignmentSubmissions([...assignmentSubmissions, newSubmission]);
      setFileToUpload(null);
      setUploadingFile(false);
      
      alert("Assignment submitted successfully!");
    }, 2000);
  };

  // Format due date
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get days remaining until due date
  const getDaysRemaining = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

        {/* Assignments Section */}
        {activeSection === 'assignments' && (
          <section className="assignments-section">
            <h1>Assignments</h1>
            
            <div className="assignment-tabs">
              <button className="tab-button active">Assigned</button>
              <button className="tab-button">Submitted</button>
              <button className="tab-button">Graded</button>
            </div>
            
            <div className="assignments-list">
              <h2>Assigned Tasks</h2>
              {teacherAssignments.map((assignment) => (
                <div className={`assignment-card ${assignment.submitted ? 'submitted' : ''}`} key={assignment.id}>
                  <div className="assignment-header">
                    <h3>{assignment.title}</h3>
                    <span className="subject-tag">{assignment.subject}</span>
                  </div>
                  
                  <p className="assignment-description">{assignment.description}</p>
                  
                  <div className="assignment-details">
                    <p className="due-date">
                      <strong>Due:</strong> {formatDueDate(assignment.dueDate)}
                      <span className={`days-remaining ${getDaysRemaining(assignment.dueDate) < 3 ? 'urgent' : ''}`}>
                        ({getDaysRemaining(assignment.dueDate)} days remaining)
                      </span>
                    </p>
                    
                    <div className="assignment-files">
                      <p><strong>Assignment File:</strong></p>
                      <a href={assignment.fileUrl} className="file-link">
                        <i className="fas fa-file-pdf"></i> {assignment.fileName}
                      </a>
                    </div>
                  </div>
                  
                  {!assignment.submitted ? (
                    <div className="assignment-submission">
                      <h4>Submit Your Work</h4>
                      <div className="file-upload">
                        <input 
                          type="file" 
                          id={`file-upload-${assignment.id}`} 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileChange}
                        />
                        <label htmlFor={`file-upload-${assignment.id}`}>
                          {fileToUpload ? fileToUpload.name : "Choose PDF file"}
                        </label>
                      </div>
                      <button 
                        className="submit-button" 
                        onClick={() => handleAssignmentSubmit(assignment.id)}
                        disabled={!fileToUpload || uploadingFile}
                      >
                        {uploadingFile ? "Uploading..." : "Submit Assignment"}
                      </button>
                    </div>
                  ) : (
                    <div className="assignment-submitted">
                      <p className="submission-status">
                        <i className="fas fa-check-circle"></i> Submitted
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="submission-history">
              <h2>Your Submissions</h2>
              {assignmentSubmissions.length > 0 ? (
                <table className="submissions-table">
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Submitted Date</th>
                      <th>File</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td>{submission.assignmentTitle}</td>
                        <td>{submission.submittedDate}</td>
                        <td>
                          <span className="file-name">{submission.fileName}</span>
                          <span className="file-size">({submission.fileSize})</span>
                        </td>
                        <td>
                          <span className="status-badge">{submission.status}</span>
                        </td>
                        <td>
                          <button className="action-button">View</button>
                          <button className="action-button">Replace</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-submissions">No submissions yet. Submit your first assignment!</p>
              )}
            </div>
          </section>
        )}

        {/* Recommendations Section */}
        {activeSection === 'recommendations' && (
          <section className="recommendations-section">
            <h1>Smart Content Recommendations</h1>
            <p>Based on your learning patterns and upcoming exams, we recommend:</p>
            
            <div className="recommended-content">
              {recommendedContent.map((item, index) => (
                <div className="content-card" key={index}>
                  <div className="content-type">{item.type}</div>
                  <h3>{item.title}</h3>
                  <p>{item.duration}</p>
                  <button>View Content</button>
                </div>
              ))}
            </div>
            
            <div className="learning-insights">
              <h2>Learning Insights</h2>
              <div className="insight-card">
                <h3>You're making great progress!</h3>
                <p>Your understanding of calculus concepts has improved by 15% in the last week.</p>
              </div>
              <div className="insight-card">
                <h3>Knowledge Gap Detected</h3>
                <p>You might want to review "Linear Algebra Transformations" before your next exam.</p>
              </div>
            </div>
          </section>
        )}

        {/* Notes Section */}
        {activeSection === 'notes' && (
          <section className="notes-section">
            <h1>Auto-Summarized Notes</h1>
            <p>AI-generated summaries of your recent lectures and notes:</p>
            
            <div className="notes-container">
              {autoSummarizedNotes.map((note, index) => (
                <div className="note-card" key={index}>
                  <h3>{note.title}</h3>
                  <p>{note.summary}</p>
                  <div className="note-actions">
                    <button>View Full Notes</button>
                    <button>Edit Summary</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="upload-notes">
              <h2>Upload New Notes</h2>
              <div className="upload-area">
                <p>Drag and drop files here, or click to browse</p>
                <button>Browse Files</button>
              </div>
            </div>
          </section>
        )}

        {/* Calendar Section */}
        {activeSection === 'calendar' && (
          <section className="calendar-section">
            <h1>Academic Calendar</h1>
            
            <div className="calendar-view">
              <div className="calendar-header">
                <button>Previous</button>
                <h2>March 2025</h2>
                <button>Next</button>
              </div>
              
              <div className="calendar-grid">
                {/* Calendar grid would be generated here */}
                <div className="placeholder-calendar">
                  <p>Calendar grid would be displayed here</p>
                </div>
              </div>
            </div>
            
            <div className="upcoming-events">
              <h2>Upcoming Events</h2>
              {calendarEvents.map((event, index) => (
                <div className="event-card" key={index}>
                  <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
                  <h3>{event.title}</h3>
                  <p>{event.time} - {event.location}</p>
                  <div className="event-actions">
                    <button>Add Reminder</button>
                    <button>View Details</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="add-event">
              <h2>Add New Event</h2>
              <form className="event-form">
                <input type="text" placeholder="Event Title" />
                <input type="date" placeholder="Date" />
                <input type="time" placeholder="Time" />
                <input type="text" placeholder="Location" />
                <button type="submit">Add Event</button>
              </form>
            </div>
          </section>
        )}

        {/* Chat Section */}
        {activeSection === 'chat' && (
          <section className="chat-section">
            <h1>Chat with Classmates</h1>
            
            <div className="chat-container">
              <div className="chat-sidebar">
                <div className="chat-search">
                  <input type="text" placeholder="Search conversations..." />
                </div>
                <div className="chat-list">
                  <div className="chat-item active">
                    <div className="chat-avatar">JD</div>
                    <div className="chat-preview">
                      <h3>John Doe</h3>
                      <p>Did you understand the homework?</p>
                    </div>
                  </div>
                  <div className="chat-item">
                    <div className="chat-avatar">SS</div>
                    <div className="chat-preview">
                      <h3>Study Group</h3>
                      <p>Meeting tomorrow at 3pm</p>
                    </div>
                  </div>
                  <div className="chat-item">
                    <div className="chat-avatar">AS</div>
                    <div className="chat-preview">
                      <h3>Alice Smith</h3>
                      <p>Thanks for the notes!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="chat-main">
                <div className="chat-header">
                  <h2>John Doe</h2>
                  <p>Online</p>
                  </div>
                
                <div className="chat-messages">
                  {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => (
                      <div className={`chat-message ${msg.sender}`} key={index}>
                        <div className="message-content">{msg.text}</div>
                        <div className="message-time">{msg.time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </div>
                
                <div className="chat-input">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cheat Sheets Section */}
        {activeSection === 'cheatsheets' && (
          <section className="cheatsheets-section">
            <h1>Last-Minute Cheat Sheets</h1>
            <p>Quick references for key formulas and concepts</p>
            
            <div className="search-filter">
              <input type="text" placeholder="Search formulas..." />
              <select>
                <option value="all">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="cs">Computer Science</option>
              </select>
            </div>
            
            <div className="cheatsheets-container">
              {cheatSheets.map((sheet, index) => (
                <div className="cheatsheet-card" key={index}>
                  <h3>{sheet.title}</h3>
                  <pre className="formula-content">{sheet.content}</pre>
                  <div className="cheatsheet-actions">
                    <button>Print</button>
                    <button>Add to Favorites</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="create-cheatsheet">
              <h2>Create Custom Cheat Sheet</h2>
              <form className="cheatsheet-form">
                <input type="text" placeholder="Title" />
                <textarea placeholder="Enter formulas and notes here..."></textarea>
                <button type="submit">Save Cheat Sheet</button>
              </form>
            </div>
          </section>
        )}

        {/* Focus & Relaxation Section */}
        {activeSection === 'focus' && (
          <section className="focus-section">
            <h1>Focus Mode & Relaxation</h1>
            
            <div className="focus-timer">
              <h2>Pomodoro Timer</h2>
              <div className="timer-display">
                {formatTime(studyTimer)}
              </div>
              <div className="timer-controls">
                <button onClick={toggleTimer}>
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer}>Reset</button>
              </div>
              <div className="timer-settings">
                <button onClick={() => setStudyTimer(25 * 60)}>25 min</button>
                <button onClick={() => setStudyTimer(45 * 60)}>45 min</button>
                <button onClick={() => setStudyTimer(60 * 60)}>60 min</button>
              </div>
            </div>
            
            <div className="task-list">
              <h2>Study Tasks</h2>
              <div className="tasks">
                {tasks.map((task, index) => (
                  <div className="task-item" key={index}>
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => {
                        const newTasks = [...tasks];
                        newTasks[index].completed = !newTasks[index].completed;
                        setTasks(newTasks);
                      }}
                    />
                    <span className={task.completed ? 'completed' : ''}>{task.text}</span>
                  </div>
                ))}
              </div>
              <div className="add-task">
                <input 
                  type="text" 
                  placeholder="Add new task..." 
                  value={newTask} 
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button onClick={handleAddTask}>Add</button>
              </div>
            </div>
            
            <div className="relaxation-exercises">
              <h2>Relaxation Exercises</h2>
              <div className="exercises-list">
                {relaxationExercises.map((exercise, index) => (
                  <div className="exercise-card" key={index}>
                    <h3>{exercise.title}</h3>
                    <p>{exercise.description}</p>
                    <button>Start Exercise</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Doubt Solving AI Section */}
        {activeSection === 'doubtai' && (
          <section className="doubtai-section">
            <h1>AI Doubt Solving Assistant</h1>
            <p>Ask any academic question and get instant help</p>
            
            <div className="question-input">
              <textarea 
                placeholder="Type your question here..." 
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
              ></textarea>
              <button onClick={handleAskQuestion} disabled={isLoading}>
                {isLoading ? 'Thinking...' : 'Ask Question'}
              </button>
            </div>
            
            {isLoading && (
              <div className="loading-indicator">
                <p>Analyzing your question...</p>
              </div>
            )}
            
            {aiResponse && (
              <div className="ai-response">
                <h2>Answer</h2>
                <div className="response-content">
                  {aiResponse}
                </div>
                <div className="response-actions">
                  <button>Save Response</button>
                  <button>Ask Follow-up</button>
                </div>
              </div>
            )}
            
            <div className="common-questions">
              <h2>Common Questions</h2>
              <div className="question-chips">
                <div className="chip" onClick={() => setCurrentQuestion("How do I solve quadratic equations?")}>
                  How do I solve quadratic equations?
                </div>
                <div className="chip" onClick={() => setCurrentQuestion("Explain the Krebs cycle")}>
                  Explain the Krebs cycle
                </div>
                <div className="chip" onClick={() => setCurrentQuestion("How does inheritance work in OOP?")}>
                  How does inheritance work in OOP?
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;