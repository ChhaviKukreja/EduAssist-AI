import React, { useState, useEffect } from 'react';

const AssignmentsTab = () => {
  const [activeSection, setActiveSection] = useState('assignments');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [studentUsername, setStudentUsername] = useState(null);
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [assignments, setAssignments] = useState([]);

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

  // Handle file selection
  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  // Upload submission handler
  const uploadSubmission = async (assignmentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to submit an assignment.");
      return;
    }

    if (!studentId) {
      alert("Student ID not found.");
      return;
    }

    if (!assignmentId) {
      alert("Assignment ID not found.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", fileToUpload);

    try {
      setUploadingFile(true);
      const res = await fetch(`http://localhost:5000/submissions/${`assignmentId`}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert("Submission uploaded successfully!");
        setFileToUpload(null);
        fetchTeacherAssignments(); // Refresh assignments status
        fetchSubmissions(); // Refresh submissions table
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Failed to upload submission", error);
    } finally {
      setUploadingFile(false);
    }
  };

  // Fetch authenticated student username
  useEffect(() => {
    const fetchStudentUsername = async () => {
      try {
        const res = await fetch('http://localhost:5000/student/auth/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
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

  // Fetch teacher assignments
  const fetchTeacherAssignments = async () => {
    try {
      const res = await fetch('http://localhost:5000/teacher/assignments', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await res.json();
      setTeacherAssignments(data);
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
    }
  };

  useEffect(() => {
    fetchTeacherAssignments();
  }, []);

  // Fetch student ID
  useEffect(() => {
    const fetchId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/student/student-id", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setStudentId(data.studentId);
      } catch (error) {
        console.error("Error fetching student ID:", error);
      }
    };

    fetchId();
  }, []);

  // Fetch assignments (optional for student assignments)
  useEffect(() => {
    const fetchStudentAssignments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/student/assignments", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setAssignments(data.assignments);
      } catch (error) {
        console.error("Error fetching student assignments:", error);
      }
    };

    fetchStudentAssignments();
  }, []);

  // Fetch student submissions
  const fetchSubmissions = async () => {
    if (!studentUsername) return;

    try {
      const res = await fetch(`http://localhost:5000/student/submissions?studentId=${studentUsername}`);
      const data = await res.json();
      setAssignmentSubmissions(data.submissions);
    } catch (error) {
      console.error('Failed to fetch submissions', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [studentUsername]);

  return (
    <div>
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
                    <a href={assignment.fileUrl} className="file-link" target="_blank" rel="noopener noreferrer">
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
                      onClick={() => uploadSubmission(assignment.id)}
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
                        <span className="file-size"> ({submission.fileSize})</span>
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
  );
};

export default AssignmentsTab;
