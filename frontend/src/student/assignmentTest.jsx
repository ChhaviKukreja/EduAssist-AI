import React, { useState, useEffect } from 'react';
import config from './config';

const API_BASE_URL = "https://eduassistbackend-chhavikukrejas-projects.vercel.app/";


const AssignmentsTab = () => {
    const [activeTab, setActiveTab] = useState('assigned');
    const [fileToUpload, setFileToUpload] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [studentUsername, setStudentUsername] = useState('');
    const [assignedAssignments, setAssignedAssignments] = useState([]);
    const [submittedAssignments, setSubmittedAssignments] = useState([]);

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

                if (!res.ok) throw new Error('Failed to authenticate');

                const data = await res.json();
                setStudentUsername(data.username);
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        fetchStudentUsername();
    }, []);

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

    // Format submission date
    const formatSubmissionDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Fetch assigned assignments (from todoAssignments)
    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/student/assignments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) throw new Error("Failed to fetch assignments");

            const data = await response.json();
            setAssignedAssignments(data);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    // Fetch submitted assignments (from submittedAssignments)
    const fetchSubmissions = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/student/submissions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });

            if (!response.ok) throw new Error("Failed to fetch submissions");

            const data = await response.json();
            setSubmittedAssignments(data);
        } catch (error) {
            console.error("Error fetching submitted assignments:", error);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [studentUsername]);

    useEffect(() => {
        if (activeTab === "submitted") fetchSubmissions();
    }, [activeTab, studentUsername]);

    // Handle file selection
    const handleFileChange = (e, assignmentId) => {
        if (e.target.files.length > 0) {
            setFileToUpload({ file: e.target.files[0], assignmentId });
        }
    };

    // Upload submission and move assignment from "Assigned" to "Submitted"
    const uploadSubmission = async (assignmentId) => {
        if (!fileToUpload || fileToUpload.assignmentId !== assignmentId) {
            alert("Please select a file for this assignment.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", fileToUpload.file);

        try {
            setUploadingFile(true);
            const res = await fetch(`${config.API_BASE_URL}/student/submit-assignment/${encodeURIComponent(studentUsername)}/${encodeURIComponent(assignmentId)}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: formData
            });

            if (!res.ok) throw new Error("Failed to upload submission");

            const data = await res.json();
            alert("Submission uploaded successfully!");

            // Move assignment from assigned to submitted
            const assignment = assignedAssignments.find(a => a._id === assignmentId);
            const submittedAssignment = {
                ...assignment,
                submittedAt: new Date().toISOString(),
                fileName: fileToUpload.file.name,
                fileSize: (fileToUpload.file.size / 1024).toFixed(2) + " KB"
            };

            setAssignedAssignments(assignedAssignments.filter(a => a._id !== assignmentId));
            setSubmittedAssignments([...submittedAssignments, submittedAssignment]);
            setFileToUpload(null);
        } catch (error) {
            console.error("Failed to upload submission", error);
            alert("An error occurred. Please try again.");
        } finally {
            setUploadingFile(false);
        }
    };

    return (
        <div className="assignments-container">
            <section className="assignments-section">
                <h1>Assignments</h1>

                <div className="assignment-tabs">
                    <button
                        className={`tab-button ${activeTab === 'assigned' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assigned')}
                    >
                        Assigned
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'submitted' ? 'active' : ''}`}
                        onClick={() => setActiveTab('submitted')}
                    >
                        Submitted
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'graded' ? 'active' : ''}`}
                        onClick={() => setActiveTab('graded')}
                    >
                        Graded
                    </button>
                </div>

                {/* Assigned Assignments Tab */}
                {activeTab === 'assigned' && (
                    <div className="assignments-list">
                        <h2>Assigned Tasks</h2>
                        {assignedAssignments.length > 0 ? (
                            assignedAssignments.map((assignment) => (
                                <div className="assignment-card" key={assignment._id}>
                                    <div className="assignment-header">
                                        <h3>{assignment.title}</h3>
                                    </div>

                                    <p className="assignment-description">{assignment.description}</p>

                                    <div className="assignment-details">
                                        <p className="due-date">
                                            <strong>Due:</strong> {formatDueDate(assignment.dueDate)}
                                            <span className={`days-remaining ${getDaysRemaining(assignment.dueDate) < 3 ? 'urgent' : ''}`}>
                                                ({getDaysRemaining(assignment.dueDate)} days remaining)
                                            </span>
                                        </p>
                                    </div>

                                    <div className="assignment-submission">
                                        <h4>Submit Your Work</h4>
                                        <div className="file-upload">
                                            <input
                                                type="file"
                                                id={`file-upload-${assignment._id}`}
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleFileChange(e, assignment._id)}
                                            />
                                            <label htmlFor={`file-upload-${assignment._id}`}>
                                                {fileToUpload && fileToUpload.assignmentId === assignment._id ?
                                                    fileToUpload.file.name : "Choose PDF file"}
                                            </label>
                                        </div>
                                        <button
                                            className="submit-button"
                                            onClick={() => uploadSubmission(assignment._id)}
                                            disabled={!fileToUpload || fileToUpload.assignmentId !== assignment._id || uploadingFile}
                                        >
                                            {uploadingFile && fileToUpload && fileToUpload.assignmentId === assignment._id ?
                                                "Uploading..." : "Submit Assignment"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-assignments">No assignments pending submission.</p>
                        )}
                    </div>
                )}

                {/* Submitted Assignments Tab */}
                {activeTab === 'submitted' && (
                    <div className="assignments-list submitted-list">
                        <h2>Submitted Assignments</h2>
                        {submittedAssignments.length > 0 ? (
                            submittedAssignments.map((submission) => (
                                <div className="assignment-card submitted" key={submission.assignmentId}>
                                    <div className="assignment-header">
                                        <h3>{submission.title}</h3>
                                        <span className="status-badge">Submitted</span>
                                    </div>

                                    <p className="assignment-description">
                                        {submission.description || "Assignment submitted successfully."}
                                    </p>

                                    <div className="assignment-details">
                                        <p className="submission-date">
                                            <strong>Submitted:</strong> {formatSubmissionDate(submission.submittedAt)}
                                        </p>
                                        <p className="file-info">
                                            <span className="file-name">{submission.fileName}</span>
                                            <span className="file-size"> ({submission.fileSize})</span>
                                        </p>
                                    </div>

                                    <div className="assignment-actions">
                                        <button
                                            className="download-button"
                                            onClick={() => downloadSubmission(submission.fileUrl, submission.fileName)}
                                        >
                                            Download Submission
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-assignments">No submitted assignments yet.</p>
                        )}
                    </div>
                )}

                {/* Graded Assignments Tab */}
                {activeTab === 'graded' && (
                    <div className="assignments-list graded-list">
                        <h2>Graded Assignments</h2>
                        {gradedAssignments.length > 0 ? (
                            gradedAssignments.map((submission) => (
                                <div className="assignment-card graded" key={submission._id || submission.assignmentId}>
                                    <div className="assignment-header">
                                        <h3>{submission.title || submission.assignmentTitle}</h3>
                                        <span className="status-badge graded">Graded</span>
                                    </div>

                                    <p className="assignment-description">
                                        {submission.description || "Assignment has been graded."}
                                    </p>

                                    <div className="assignment-details">
                                        <p className="submission-date">
                                            <strong>Submitted:</strong> {formatSubmissionDate(submission.submittedAt)}
                                        </p>
                                        <p className="grade-info">
                                            <strong>Grade:</strong> {submission.grade || "A"}
                                        </p>
                                        <p className="file-info">
                                            <span className="file-name">{submission.fileName}</span>
                                            <span className="file-size"> ({submission.fileSize})</span>
                                        </p>
                                    </div>

                                    <div className="assignment-actions">
                                        <button
                                            className="download-button"
                                            onClick={() => downloadSubmission(
                                                submission._id || submission.assignmentId,
                                                submission.fileName
                                            )}
                                        >
                                            Download Submission
                                        </button>
                                        {submission.feedbackFile && (
                                            <button
                                                className="feedback-button"
                                                onClick={() => downloadSubmission(
                                                    submission._id || submission.assignmentId,
                                                    "Feedback-" + submission.fileName
                                                )}
                                            >
                                                Download Feedback
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-assignments">No graded assignments yet.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AssignmentsTab;