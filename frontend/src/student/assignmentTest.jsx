import React, { useState, useEffect } from 'react';
import config from './config';

const AssignmentsTab = () => {
    const [activeTab, setActiveTab] = useState('assigned');
    const [fileToUpload, setFileToUpload] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [studentUsername, setStudentUsername] = useState('');
    const [assignedAssignments, setAssignedAssignments] = useState([]);
    const [submittedAssignments, setSubmittedAssignments] = useState([]);
    const [gradedAssignments, setGradedAssignments] = useState([]);

    // Existing authentication and fetch functions remain the same
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

    // Helper functions for date formatting
    const getDaysRemaining = (dateString) => {
        const dueDate = new Date(dateString);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDueDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatSubmissionDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Fetch functions (with minor modifications to match UI)
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

    // Add a placeholder fetch for graded assignments
    const fetchGradedAssignments = async () => {
        // This would typically come from your backend
        setGradedAssignments([]);
    };

    useEffect(() => {
        fetchAssignments();
        fetchGradedAssignments();
    }, [studentUsername]);

    useEffect(() => {
        if (activeTab === "submitted") fetchSubmissions();
    }, [activeTab, studentUsername]);

    // File upload handlers
    const handleFileChange = (e, assignmentId) => {
        if (e.target.files.length > 0) {
            setFileToUpload({ file: e.target.files[0], assignmentId });
        }
    };

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

    // Placeholder download function
    const downloadSubmission = (fileUrl, fileName) => {
        // Implement actual download logic
        console.log(`Downloading ${fileName} from ${fileUrl}`);
    };

    return (
        <div className="bg-[#121621] min-h-screen text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Assignments</h1>

                {/* Tabs */}
                <div className="flex mb-6 bg-[#1E2433] rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 rounded-lg ${activeTab === 'assigned' ? 'bg-[#5570F1] text-white' : 'text-[#8991A4] hover:bg-[#2A3242]'}`}
                        onClick={() => setActiveTab('assigned')}
                    >
                        Assigned
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-lg ${activeTab === 'submitted' ? 'bg-[#5570F1] text-white' : 'text-[#8991A4] hover:bg-[#2A3242]'}`}
                        onClick={() => setActiveTab('submitted')}
                    >
                        Submitted
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-lg ${activeTab === 'graded' ? 'bg-[#5570F1] text-white' : 'text-[#8991A4] hover:bg-[#2A3242]'}`}
                        onClick={() => setActiveTab('graded')}
                    >
                        Graded
                    </button>
                </div>

                {/* Assigned Assignments Tab */}
                {activeTab === 'assigned' && (
                    <div>
                        {assignedAssignments.length > 0 ? (
                            assignedAssignments.map((assignment) => (
                                <div key={assignment._id} className="bg-[#1E2433] rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">{assignment.title}</h3>
                                        <span className={`text-sm ${getDaysRemaining(assignment.dueDate) < 3 ? 'text-red-500' : 'text-[#8991A4]'}`}>
                                            {formatDueDate(assignment.dueDate)} ({getDaysRemaining(assignment.dueDate)} days remaining)
                                        </span>
                                    </div>

                                    <p className="text-[#8991A4] mb-4">{assignment.description}</p>

                                    <div className="bg-[#121621] rounded-lg p-3">
                                        <div className="mb-3">
                                            <input
                                                type="file"
                                                id={`file-upload-${assignment._id}`}
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleFileChange(e, assignment._id)}
                                                className="hidden"
                                            />
                                            <label 
                                                htmlFor={`file-upload-${assignment._id}`}
                                                className="block w-full text-center py-2 bg-[#2A3242] text-[#8991A4] rounded-lg cursor-pointer"
                                            >
                                                {fileToUpload && fileToUpload.assignmentId === assignment._id 
                                                    ? fileToUpload.file.name 
                                                    : "Choose PDF file"}
                                            </label>
                                        </div>
                                        <button
                                            className="w-full py-2 bg-[#5570F1] text-white rounded-lg disabled:opacity-50"
                                            onClick={() => uploadSubmission(assignment._id)}
                                            disabled={!fileToUpload || fileToUpload.assignmentId !== assignment._id || uploadingFile}
                                        >
                                            {uploadingFile && fileToUpload && fileToUpload.assignmentId === assignment._id 
                                                ? "Uploading..." 
                                                : "Submit Assignment"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[#8991A4]">No assignments pending submission.</p>
                        )}
                    </div>
                )}

                {/* Submitted Assignments Tab */}
                {activeTab === 'submitted' && (
                    <div>
                        {submittedAssignments.length > 0 ? (
                            submittedAssignments.map((submission) => (
                                <div key={submission.assignmentId} className="bg-[#1E2433] rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">{submission.title}</h3>
                                        <span className="text-green-500 text-sm">Submitted</span>
                                    </div>

                                    <p className="text-[#8991A4] mb-2">{formatSubmissionDate(submission.submittedAt)}</p>

                                    <div className="bg-[#121621] rounded-lg p-3 flex justify-between items-center">
                                        <div>
                                            <p className="text-[#8991A4]">{submission.fileName}</p>
                                            <p className="text-xs text-[#8991A4]">({submission.fileSize})</p>
                                        </div>
                                        <button
                                            className="py-2 px-4 bg-[#5570F1] text-white rounded-lg"
                                            onClick={() => downloadSubmission(submission.fileUrl, submission.fileName)}
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[#8991A4]">No submitted assignments.</p>
                        )}
                    </div>
                )}

                {/* Graded Assignments Tab */}
                {activeTab === 'graded' && (
                    <div>
                        {gradedAssignments.length > 0 ? (
                            gradedAssignments.map((assignment) => (
                                <div key={assignment._id} className="bg-[#1E2433] rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">{assignment.title}</h3>
                                        <span className="text-purple-500 text-sm">Graded</span>
                                    </div>
                                    {/* Add more graded assignment details as needed */}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[#8991A4]">No graded assignments yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentsTab;