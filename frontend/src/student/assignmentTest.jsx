import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, LabelList } from 'recharts';
import config from './config';

const AssignmentsTab = ({ initialTab = 'assigned' }) => {
    const [activeTab, setActiveTab] = useState('assigned');
    const [fileToUpload, setFileToUpload] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [studentUsername, setStudentUsername] = useState('');
    const [assignedAssignments, setAssignedAssignments] = useState([]);
    const [submittedAssignments, setSubmittedAssignments] = useState([]);
    const [gradedAssignments, setGradedAssignments] = useState([]);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
    const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState('');
    const [selectedSubmissionTitle, setSelectedSubmissionTitle] = useState('');
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [assignmentTitles, setAssignmentTitles] = useState({});
    const [submissionTitle, setSubmissionTitle] = useState(""); // New state for submission title


    const [selectedFileTitle, setSelectedFileTitle] = useState("");
    const [gradeDistribution, setGradeDistribution] = useState([]);
    const [gradeProgress, setGradeProgress] = useState([]);
    const [selectedGradedAssignment, setSelectedGradedAssignment] = useState(null);
    const [feedbackHighlights, setFeedbackHighlights] = useState([]);

    // Set active tab based on prop when component mounts
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

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

    const fetchAssignmentTitle = async (assignmentId) => {
        if (!assignmentId || assignmentTitles[assignmentId]) return; // Avoid duplicate requests

        console.log("Fetching title for assignmentId:", assignmentId); // Debugging

        try {
            const response = await fetch(`${config.API_BASE_URL}/student/assignment/${assignmentId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch assignment title");
            }
            const data = await response.json();

            console.log("Fetched title:", data.title); // Debugging

            setAssignmentTitles((prev) => ({ ...prev, [assignmentId]: data.title }));
        } catch (error) {
            console.error("Error fetching assignment title:", error);
        }
    };

    const processGradeData = (assignments) => {
        // Process grade distribution
        const gradeRanges = [
            { name: 'A (90-100)', value: 0, color: '#4CAF50' },
            { name: 'B (80-89)', value: 0, color: '#8BC34A' },
            { name: 'C (70-79)', value: 0, color: '#FFC107' },
            { name: 'D (60-69)', value: 0, color: '#FF9800' },
            { name: 'F (<60)', value: 0, color: '#F44336' }
        ];

        assignments.forEach(assignment => {
            const grade = assignment.grade;
            if (grade >= 90) gradeRanges[0].value++;
            else if (grade >= 80) gradeRanges[1].value++;
            else if (grade >= 70) gradeRanges[2].value++;
            else if (grade >= 60) gradeRanges[3].value++;
            else gradeRanges[4].value++;
        });

        setGradeDistribution(gradeRanges);

        // Process timeline data
        const sortedByDate = [...assignments].sort((a, b) =>
            new Date(a.gradedAt) - new Date(b.gradedAt)
        );

        const progressData = sortedByDate.map(assignment => ({
            name: assignment.title.substring(0, 10) + (assignment.title.length > 10 ? '...' : ''),
            value: assignment.grade,
            label:null,
            date: formatDueDate(assignment.gradedAt)
        }));

        setGradeProgress(progressData);

        // Process feedback keywords
        const feedbackWords = {};
        assignments.forEach(assignment => {
            if (assignment.feedback) {
                const words = assignment.feedback.toLowerCase()
                    .split(/\s+/)
                    .filter(word => word.length > 3);

                words.forEach(word => {
                    if (feedbackWords[word]) feedbackWords[word]++;
                    else feedbackWords[word] = 1;
                });
            }
        });

        const feedbackData = Object.entries(feedbackWords)
            .map(([text, value]) => ({ text, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        setFeedbackHighlights(feedbackData);
    };

    // Add this function to view assignment details
    const viewGradedAssignment = (assignment) => {
        setSelectedGradedAssignment(assignment);
        setSelectedPdfUrl(`${config.API_BASE_URL}/student/submissions/${assignment.submissionId}`);
        setShowPdfModal(true);
    };


    useEffect(() => {
        console.log("useEffect triggered with submittedAssignments:", submittedAssignments);

        submittedAssignments.forEach((submission) => {
            if (submission.assignmentId) {
                fetchAssignmentTitle(submission.assignmentId);
            }
        });
    }, [submittedAssignments]);

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
            console.log("DATA", data);
            // Extracting all titles from the array
            const titles = data.map(submission => submission.title);
            console.log("Titles:", titles);

            if (data.length > 0) {
                setSubmissionTitle(data.map(sub => sub.title).join(", ")); // Converts array to a string
            } else {
                setSubmissionTitle(""); // Empty if no submissions
            }

            setSubmittedAssignments(data);
        } catch (error) {
            console.error("Error fetching submitted assignments:", error);
        }
    };

    // Add a placeholder fetch for graded assignments
    const fetchGradedAssignments = async () => {
        // This would typically come from your backend
        const mockData = generateMockGradedAssignments();
        setGradedAssignments(mockData);
        processGradeData(mockData);
    };

    useEffect(() => {
        fetchAssignments();
        fetchGradedAssignments();
    }, [studentUsername]);

    useEffect(() => {
        if (activeTab === "submitted") fetchSubmissions();
    }, [activeTab, studentUsername]);

    // PDF preview modal functions
    const openPdfPreview = (assignmentId, title) => {
        setSelectedPdfUrl(`${config.API_BASE_URL}/student/assignments/${assignmentId}`);
        setSelectedAssignmentTitle(title);
        setShowPdfModal(true);
        // assignedAssignments
    };



    const closePdfModal = () => {
        setShowPdfModal(false);
        setSelectedPdfUrl('');
        setSelectedAssignmentTitle('');
    };

    const openPdfPreviewSub = (submissionId, title) => {
        setSelectedPdfUrl(`${config.API_BASE_URL}/student/submissions/${submissionId}`);
        setSelectedSubmissionTitle(title);
        setShowPdfModal(true);
        // assignedAssignments
    };

    const closePdfModalSub = () => {
        setShowPdfModal(false);
        setSelectedPdfUrl('');
        setSelectedSubmissionTitle('');
    };

    // File upload handlers
    const handleFileChange = (e, assignmentId) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileToUpload({ file: file, assignmentId });
            // Store file name for display
            setFileName(file.name);
            setSelectedFileTitle(file.name);
        }
    };

    const uploadSubmission = async (assignmentId) => {
        if (!fileToUpload || fileToUpload.assignmentId !== assignmentId) {
            alert("Please select a file for this assignment.");
            return;
        }
        const formData = new FormData();
        formData.append("pdf", fileToUpload.file);

        const fileNameWithoutExtension = fileToUpload.file.name.replace(/\.[^/.]+$/, ""); // Removes extension
        setSubmissionTitle(fileNameWithoutExtension);

        try {
            setUploadingFile(true);
            const res = await fetch(`${config.API_BASE_URL}/student/submit-assignment/${encodeURIComponent(studentUsername)}/${encodeURIComponent(assignmentId)}/${encodeURIComponent(fileNameWithoutExtension)}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: formData
            });

            if (!res.ok) throw new Error("Failed to upload submission");

            const data = await res.json();
            alert("Submission uploaded successfully!");

            // Get the assignment details to include in the submission record
            const assignment = assignedAssignments.find(a => a._id === assignmentId);

            // Create the submitted assignment record with the file name as the submission title
            const submittedAssignment = {
                ...assignment,
                submittedAt: new Date().toISOString(),
                fileName: fileToUpload.file.name,
                fileSize: (fileToUpload.file.size / 1024).toFixed(2) + " KB",
                submissionTitle: fileToUpload.file.name, // Set submission title to the file name
                title: fileToUpload.file.name // Also update the title for display
            };

            // Persist the updated submittedAssignments list
            setSubmittedAssignments((prev) => [...prev, submittedAssignment]);

            // Remove the assignment from assignedAssignments
            setAssignedAssignments((prev) => prev.filter(a => a._id !== assignmentId));

            // Refresh the submissions list
            fetchSubmissions();

            // Reset file upload state
            setFileToUpload(null);
            setSelectedFile(null);
            setFileName('');
        } catch (error) {
            console.error("Failed to upload submission", error);
            alert("An error occurred. Please try again.");
        } finally {
            setUploadingFile(false);
        }
    };

    const generateMockGradedAssignments = () => {
        const mockAssignments = [
            {
                _id: 'g1',
                title: 'Introduction to React',
                submissionId: 's1',
                grade: 92,
                gradedAt: '2025-03-01T10:00:00Z',
                feedback: 'Excellent work! Your component structure shows great understanding of React principles. Consider adding more comments to complex logic sections.'
            },
            {
                _id: 'g2',
                title: 'State Management',
                submissionId: 's2',
                grade: 85,
                gradedAt: '2025-03-10T14:30:00Z',
                feedback: 'Good implementation of useState and useEffect. Next time try to reduce redundant state variables and consider using useReducer for complex state.'
            },
            {
                _id: 'g3',
                title: 'API Integration',
                submissionId: 's3',
                grade: 78,
                gradedAt: '2025-03-18T09:15:00Z',
                feedback: 'Your fetch implementation works but lacks error handling. Make sure to implement loading states and proper error messaging for users.'
            },
            {
                _id: 'g4',
                title: 'Routing & Navigation',
                submissionId: 's4',
                grade: 95,
                gradedAt: '2025-03-25T16:45:00Z',
                feedback: 'Outstanding navigation structure! Your route protection and state persistence between routes shows advanced understanding.'
            },
            {
                _id: 'g5',
                title: 'Form Validation',
                submissionId: 's5',
                grade: 63,
                gradedAt: '2025-04-02T11:20:00Z',
                feedback: 'The form works but has several validation issues. Review the validation techniques we discussed in class and implement proper error messaging.'
            },
        ];

        return mockAssignments;
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
                                        <button
                                            onClick={() => openPdfPreview(assignment._id, assignment.title)}
                                            className="text-blue-400 hover:underline font-semibold"
                                        >
                                            {assignment.title}
                                        </button>
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
                                            className="w-full py-2 bg-[#5570F1] text-white rounded-lg disabled:opacity-100"
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
                        <h2 className="text-xl font-bold mb-4">Submitted Assignments</h2>

                        {submittedAssignments.length > 0 ? (
                            submittedAssignments.map((submission) => (
                                <div key={submission._id} className="bg-[#1E2433] rounded-lg p-4 mb-4">


                                    {/* Original Assignment Title */}
                                    <h2 className="text-lg font-bold text-white mb-2">
                                        {assignmentTitles[submission.assignmentId] || "Loading..."}
                                    </h2>

                                    {/* Submitted Assignment Title - Uses the stored submission title */}
                                    <div className="flex justify-between items-center mb-2">
                                        {/* <h3 className="font-semibold text-blue-400">
                                            {submission.submissionTitle || submission.title || submission.fileName || "No file name"}
                                        </h3> */}
                                        <button
                                            onClick={() => openPdfPreviewSub(submission._id, submission.title)}
                                            className="text-blue-400 hover:underline font-semibold"
                                        >
                                            {submission.title}
                                        </button>

                                        <span className="text-green-500 text-sm">
                                            Submitted {formatSubmissionDate(submission.submittedAt)}
                                        </span>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="bg-[#1E2433] rounded-lg p-8 text-center">
                                <p className="text-[#8991A4]">No submitted assignments.</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'graded' && (
                    <div>
                        {gradedAssignments.length > 0 ? (
                            <div className="space-y-6">
                                {/* Analytics Overview */}
                                <div className="bg-[#1E2433] rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4">Performance Overview</h3>

                                    <div className="flex flex-col space-y-6">
                                        {/* Grade Distribution */}
                                        <div className="bg-[#121621] rounded-lg p-4 w-full">
                                            <h4 className="font-medium text-center mb-2">Grade Distribution</h4>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={gradeDistribution}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={2}
                                                            dataKey="value"
                                                            label={({ name, percent }) =>
                                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                                            }
                                                            isAnimationActive={true}
                                                            animationBegin={0}
                                                            animationDuration={1400}
                                                            animationEasing="ease-out"
                                                        >
                                                            {gradeDistribution.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Progress Over Time */}
                                        <div className="bg-[#121621] rounded-lg p-4 w-full">
                                            <h4 className="font-medium text-center mb-2">Grade Progress</h4>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart
                                                        data={gradeProgress}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#2A3242" />
                                                        <XAxis
                                                            dataKey="date"
                                                            angle={-45}
                                                            textAnchor="end"
                                                            height={60}
                                                            stroke="#8991A4"
                                                        />
                                                        <YAxis domain={[0, 100]} stroke="#8991A4" />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: '#1E2433',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                                                            }}
                                                        />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="value"
                                                            label = {false}
                                                            //name="Grade"
                                                            stroke="#5570F1"
                                                            activeDot={{ r: 8 }}
                                                            strokeWidth={2}
                                                        />
                                                         <LabelList dataKey="value" position="top" content={() => null} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Assignment List */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Assignment Details</h3>
                                    {gradedAssignments.map((assignment) => (
                                        <div key={assignment._id} className="bg-[#1E2433] rounded-lg p-4 hover:bg-[#252B3B] transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                                    <p className="text-[#8991A4] text-sm">Graded on {formatDueDate(assignment.gradedAt)}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="mr-4 text-right">
                                                        <span className={`text-xl font-bold ${assignment.grade >= 90 ? 'text-green-500' :
                                                            assignment.grade >= 80 ? 'text-green-400' :
                                                                assignment.grade >= 70 ? 'text-yellow-400' :
                                                                    assignment.grade >= 60 ? 'text-orange-400' : 'text-red-500'
                                                            }`}>
                                                            {assignment.grade}%
                                                        </span>
                                                        <p className="text-[#8991A4] text-xs">
                                                            {
                                                                assignment.grade >= 90 ? 'Excellent' :
                                                                    assignment.grade >= 80 ? 'Great' :
                                                                        assignment.grade >= 70 ? 'Good' :
                                                                            assignment.grade >= 60 ? 'Fair' : 'Needs Improvement'
                                                            }
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => viewGradedAssignment(assignment)}
                                                        className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-[#4560E1] transition-colors"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>

                                            {assignment.feedback && (
                                                <div className="mt-3 bg-[#121621] p-3 rounded-lg">
                                                    <h4 className="font-medium text-sm text-[#8991A4] mb-1">Instructor Feedback:</h4>
                                                    <p className="text-white">{assignment.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#1E2433] rounded-lg p-8 text-center">
                                <div className="text-4xl mb-4">📚</div>
                                <p className="text-[#8991A4] mb-2">No graded assignments yet.</p>
                                <p className="text-[#8991A4] text-sm">Your graded assignments will appear here once your instructor evaluates your work.</p>
                            </div>
                        )}
                    </div>
                )}
                {/* PDF Preview Modal */}
                {showPdfModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1E2433] rounded-lg w-full max-w-3xl h-full flex flex-col">
                            <div className="p-4 flex justify-between items-center border-b border-[#2A3242]">
                                <h3 className="font-semibold text-lg">{selectedAssignmentTitle}</h3>
                                <button
                                    onClick={closePdfModal}
                                    className="text-[#8991A4] hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 p-2 bg-[#121621] overflow-hidden">
                                <iframe
                                    src={selectedPdfUrl}
                                    className="w-full h-full rounded border-0"
                                    title="PDF Preview"
                                />
                            </div>
                            <div className="p-4 flex justify-end border-t border-[#2A3242]">
                                <button
                                    onClick={closePdfModal}
                                    className="py-2 px-6 bg-[#5570F1] text-white rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showPdfModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1E2433] rounded-lg w-full max-w-3xl h-full flex flex-col">
                            <div className="p-4 flex justify-between items-center border-b border-[#2A3242]">
                                <h3 className="font-semibold text-lg">{selectedSubmissionTitle}</h3>
                                <button
                                    onClick={closePdfModalSub}
                                    className="text-[#8991A4] hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 p-2 bg-[#121621] overflow-hidden">
                                <iframe
                                    src={selectedPdfUrl}
                                    className="w-full h-full rounded border-0"
                                    title="PDF Preview"
                                />
                            </div>
                            <div className="p-4 flex justify-end border-t border-[#2A3242]">
                                <button
                                    onClick={closePdfModalSub}
                                    className="py-2 px-6 bg-[#5570F1] text-white rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
};

export default AssignmentsTab;