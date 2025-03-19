const [fileToUpload, setFileToUpload] = useState(null);
const [uploadingFile, setUploadingFile] = useState(false);
const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
const [studentUsername, setStudentUsername] = useState(null);
const [teacherAssignments, setTeacherAssignments] = useState([]);
const [studentId, fetchStudentId] = useState([]);
const [assignment, fetchAssignments] = useState([])


// Get days remaining until due date
const getDaysRemaining = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};


// Format due date
const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

// Handle file selection for assignment submission
const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
};

//upload Assignment
const uploadSubmission = async (file) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to submit an assignment.");
        return;
    }

    const studentId = await fetchStudentId(); // Get studentId from API
    if (!studentId) {
        alert("Student ID not found.");
        return;
    }

    const assignmentId = selectedAssignmentId || assignmentIdFromURL; // Use selected or URL assignment ID
    if (!assignmentId) {
        alert("Assignment ID not found.");
        return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
        const res = await fetch(`http://localhost:5000/submissions/${assignmentId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Attach token for authentication
            },
            body: formData
        });

        const data = await res.json();
        if (res.ok) {
            alert("Submission uploaded successfully!");
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Failed to upload submission", error);
    }
};


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
    const fetchStudentId = async () => {
        const token = localStorage.getItem("token");

        if (!token) return null;

        try {
            const res = await fetch("http://localhost:5000/student/student-id", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            return data.studentId; // Use this as studentId
        } catch (error) {
            console.error("Error fetching student ID:", error);
            return null;
        }
    };
    fetchStudentId();
}, []);

useEffect(() => {
    const fetchesAssignments = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const res = await fetch("http://localhost:5000/student/assignments", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            fetchAssignments(data.assignments); // Store assignments in state
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };
    fetchAssignments();
}, [])

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
            const res = await fetch(`http://localhost:5000/student/submissions?studentId=${studentUsername}`);
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

}, [timerRunning, studyTimer, activeSection, studentUsername, studentId, assignment]);

// Toggle focus mode
const toggleFocusMode = () => {
    setFocusMode(!focusMode);
};

return(
    <div>
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
                        onClick={() => uploadSubmission()}
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

    </div>
)