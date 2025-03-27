import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import config from './config';
const API_BASE_URL = "https://eduassistbackend-chhavikukrejas-projects.vercel.app";

const AutoGrade = ({ }) => {
  // State management
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('assignments');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
  const [isProcessingGrades, setIsProcessingGrades] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [teacherUsername, setTeacherUsername] = useState(null);
  const [formInputs, setFormInputs] = useState({
    title: '',
    description: '',
    uploadedBy: '',
    dueDate: ''
  });

  const [analyticsData, setAnalyticsData] = useState({
    gradeDistribution: {},
    submissionStatus: {},
    performanceMetrics: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data
  const [assignments, setAssignments] = useState([]);


  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchTeacherUsername = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/teacher/auth/check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Or however you're storing the token
          }
        });

        if (!res.ok) {
          throw new Error('Failed to authenticate');
        }

        const data = await res.json();
        console.log(data);
        console.log("email", data.email);
        setTeacherUsername(data.email);
        console.log('Authenticated username:', data.email);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    fetchTeacherUsername();
  }, []);


  // Action handlers

  //const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);


  // Trigger hidden input on "browse" click
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
      console.log('File selected:', file.name);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleInputChange = (e) => {
    // fileInputRef.current.click();
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a PDF file before submitting.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', formInputs.title);
      formData.append('description', formInputs.description);
      formData.append('uploadedBy', formInputs.uploadedBy);
      formData.append('dueDate', formInputs.dueDate);
      formData.append('pdf', selectedFile);

      const response = await fetch(`${config.API_BASE_URL}/teacher/assignments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Or however you're storing the token
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload assignment');
      }

      const data = await response.json();

      // Add the newly uploaded assignment to the list
      const newAssignment = {
        id: assignments.length + 1, // You might use data._id from backend
        title: formInputs.title,
        dueDate: formInputs.dueDate,
        status: 'active',
        totalSubmissions: 0,
        pendingGrading: 0
      };

      setAssignments([...assignments, newAssignment]);
      alert('Assignment uploaded successfully!');

      // Reset the form
      setFormInputs({
        title: '',
        description: '',
        uploadedBy: '',
        dueDate: ''
      });
      setSelectedFile(null);
      setFileName('');
      setShowNewAssignmentForm(false);
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert('Failed to upload assignment.');
    }
  };

  useEffect(() => {
    if (activeTab === "assignments") {
      fetchAssignments();
    }
  }, [activeTab]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/teacher/assignments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleGradeClick = (student) => {
    setSelectedStudent(student);
    setShowFeedbackForm(true);
  };

  const handleNewAssignmentSubmit = (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const newAssignment = {
      id: assignments.length + 1,
      title: formData.get('title'),
      dueDate: formData.get('dueDate'),
      status: 'active',
      totalSubmissions: 0,
      pendingGrading: 0
    };

    // Add new assignment to state
    setAssignments([...assignments, newAssignment]);
    setShowNewAssignmentForm(false);
  };

  // Render the main content area based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case "assignments":
        return renderAssignmentsTab();
      case "submissions":
        return renderSubmissionsTab();
      case "analytics":
        return renderAnalyticsTab();
      default:
        return renderAssignmentsTab();
    }
  };

  const handleSelect = (submissionId) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId) ? prev.filter(id => id !== submissionId) : [...prev, submissionId]
    );
  };


  const handleBatchGrade = async () => {
    if (selectedSubmissions.length === 0) {
      toast.error("No submissions selected!");
      return;
    }
    setIsProcessingGrades(true);
    console.log("yooooooooooooooo");
    try {
      const res = await fetch(`${config.API_BASE_URL}/teacher/grade/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ submissionIds: selectedSubmissions })
      });
      setIsProcessingGrades(false);

      if (!res.ok) {
        throw new Error(`Batch grading failed: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Response from server:", data);
      toast.success("Batch grading completed!");

      const updatedSubmissions = submissions.map(sub => {
        const gradedSub = res.data.results.find(r => r.submissionId === sub._id);
        return gradedSub ? { ...sub, score: gradedSub.score, feedback: gradedSub.feedback } : sub;
      });

      setSubmissions(updatedSubmissions);
      setShowFeedbackForm(true);
      setSelectedSubmissions([]);
      setSelectedStudent(selectedSubmissions); // Get the first selected submission

      console.log("Before alert...");
      alert("Auto-grading completed successfully!");
      console.log("After alert...");
      //navigate("/auto-grading");
      window.location.reload()

      // Switch to "submissions" tab
      setActiveTab("submissions");

      // Navigate to the auto-grading page
    } catch (err) {
      toast.error("Batch grading failed!");
    }
  };


  useEffect(() => {
    fetch(`${config.API_BASE_URL}/teacher/submissions`) // Adjust the API URL as needed
      .then(response => response.json())
      .then(data => {
        console.log("Assignments with submissions:", data);
        setAssignments(data);
      })
      .catch(error => console.error("Error fetching assignments:", error));
  }, []);

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);


  const fetchAnalytics = async () => {
    console.log("khjbn");
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/teacher/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };


  const renderAssignmentsTab = () => {
    console.log(assignments);
    console.log(typeof assignments);
    return (

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assignments</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowNewAssignmentForm(true)}
          >
            Create New Assignment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Submissions</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{assignment.title}</td>
                  <td className="px-4 py-3">{assignment.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {assignment.status === 'active' ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span>{assignment.totalSubmissions} total</span>
                      {assignment.pendingGrading > 0 && (
                        <span className="text-amber-600 text-sm">{assignment.pendingGrading} pending grading</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        onClick={() => setActiveTab('submissions')}
                      >
                        View Submissions
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  };

  const renderSubmissionsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Student Submissions</h2>
          <div className="flex space-x-3">
            <select className="border rounded px-3 py-2">
              <option>All Assignments</option>
            </select>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleBatchGrade}
              disabled={(!selectedSubmissions || selectedSubmissions.length === 0) && isProcessingGrades}
            >
              {isProcessingGrades ? (
                <>
                  <span className="mr-2">Processing</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </>
              ) : (
                'Auto Grade Submissions'
              )}

            </button>
          </div>
        </div>

        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Select</th>
              <th className="px-4 py-2 border">Student Email</th>
              <th className="px-4 py-2 border">Submission Date</th>
              <th className="px-4 py-2 border">Score</th>
              <th className="px-4 py-2 border">Feedback</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) =>
              assignment.specificSubmission.map((submission) => (
                <tr key={submission._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.includes(submission._id)}
                      onChange={() => handleSelect(submission._id)}
                    />
                  </td>
                  <td className="px-4 py-3">{submission.studentEmail}</td>
                  <td className="px-4 py-3">{new Date(submission.submittedAt).toLocaleString() || "N/A"}</td>
                  <td className="px-4 py-3">{submission.score !== undefined ? submission.score : "Not graded yet"}</td>
                  {/* <td className="px-4 py-3">{submission.feedback || "N/A"}</td> */}
                  <td className="px-4 py-3">
                    {submission.submittedAt && (
                      <button
                        className={`px-3 py-1 rounded text-sm ${submission.feedback ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}
                        onClick={() => {
                          handleGradeClick(students);
                        }}

                      >

                        {submission.feedback ? 'Show Feedback' : 'Add Feedback'}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={submission.submittedAt ? "text-green-600" : "text-red-600"}>
                      {submission.submittedAt ? "Submitted" : "Missing"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleSelect(submission._id)}
                    >
                      {selectedSubmissions.includes(submission._id) ? "Deselect" : "Select"}
                    </button>
                  </td>
                </tr>
              ))
            )};
          </tbody>
        </table>
      </div>
    );
  };


  const renderAnalyticsTab = () => {
    console.log("hehe");

    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading analytics...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="text-red-600 flex items-center">
            <AlertCircle className="mr-2" />
            <span>Error loading analytics: {error}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Assignment Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Grade Distribution</h3>
            <div className="flex flex-col space-y-2">
              {Object.entries(analyticsData.gradeDistribution || {}).map(([grade, percentage]) => (
                <div key={grade} className="flex items-center">
                  <span className="w-8">{grade}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${grade === 'A' ? 'bg-green-600' :
                        grade === 'B' ? 'bg-blue-600' :
                          grade === 'C' ? 'bg-yellow-600' :
                            'bg-red-600'
                        }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Status */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Submission Status</h3>
            <div className="flex items-center justify-center h-32">
              {Object.entries(analyticsData.submissionStatus || {}).map(([status, percentage]) => (
                <div key={status} className="flex flex-col items-center mx-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${status === 'On Time' ? 'bg-green-100' :
                      status === 'Late' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}
                  >
                    <span
                      className={`text-lg font-semibold ${status === 'On Time' ? 'text-green-600' :
                        status === 'Late' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <span className="mt-2 text-sm">{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="border rounded-lg p-4 col-span-full">
            <h3 className="font-medium mb-2">Performance Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(analyticsData.performanceMetrics || {}).map(([metric, value]) => (
                <div key={metric} className="bg-gray-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">{metric}</h4>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the feedback form modal
  const renderFeedbackForm = () => {
    console.log("submission", selectedSubmissions);
    console.log("assignments", assignments);

    if (!showFeedbackForm || !selectedSubmissions.length === 0) return null;

    const allSubmissions = assignments.flatMap(assignment => assignment.specificSubmission);

    // Find the matching submission object
    const currentSubmission = allSubmissions.find(sub => sub._id === selectedSubmissions[0]);
    console.log("curr", currentSubmission);
    if (!currentSubmission) return null; // Prevent errors if not found

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Feedback for {currentSubmission.studentEmail}
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowFeedbackForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Score
            </label>
            <div className="flex items-center">
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={currentSubmission.score}
                readOnly
              />
              {/* <div className="ml-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 w-64">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${currentSubmission.performance}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{currentSubmission.performance}% Performance</span>
              </div> */}
            </div>
          </div>

          {/* <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Assignment Submission
              </label>
              <button className="text-sm text-blue-600">Download</button>
            </div>
            <div className="border rounded p-3 bg-gray-50 flex items-center">
              <FileText size={18} className="text-gray-500 mr-2" />
              <span className="text-sm">assignment_submission_{selectedStudent.id}.pdf</span>
            </div>
          </div> */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strengths
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 h-20"
              placeholder="Mention the student's strengths..."
              defaultValue={
                currentSubmission.feedback && currentSubmission.feedback.length > 0
                  ? currentSubmission.feedback[0].strengths
                  : ""
              }
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Areas for Improvement
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 h-20"
              placeholder="Mention areas the student can improve..."
              defaultValue={
                currentSubmission.feedback && currentSubmission.feedback.length > 0
                  ? currentSubmission.feedback[0].improvements
                  : ""
              }
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generate AI Feedback Suggestions
            </label>
            <div className="border rounded p-3 mb-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm">Feedback Suggestions</h4>
                <span className="text-xs text-gray-500">Using ML model</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm">Good use of supporting evidence in section 2. The citations were well-integrated.</p>
                </div>
                <div className="flex items-start">
                  <AlertCircle size={16} className="text-amber-500 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm">The conclusion lacks clear connection to the main thesis. Consider strengthening this relationship.</p>
                </div>
                <div className="flex items-start">
                  <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm">Effective use of technical terminology throughout the paper.</p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Insert All
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                  Regenerate
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                Structure & Organization
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                Content Depth
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                Technical Accuracy
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              onClick={() => setShowFeedbackForm(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                // Update the student record to mark feedback as provided
                setStudents(students.map(s =>
                  s.id === selectedStudent.id ? { ...s, feedback: true } : s
                ));
                setShowFeedbackForm(false);
              }}
            >
              Save Feedback
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the new assignment form modal
  const renderNewAssignmentForm = () => {
    if (!showNewAssignmentForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Assignment</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewAssignmentForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                value={formInputs.title}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter a title for the assignment"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formInputs.description}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 h-24"
                placeholder="Enter detailed instructions for students..."
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formInputs.dueDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Possible
                </label>
                <input
                  type="number"
                  name="points"
                  className="w-full border rounded px-3 py-2"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:border-blue-400 transition"
                onClick={handleBrowseClick}>
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop your assignment file, or <span
                    onClick={handleBrowseClick}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    browse
                  </span>
                </p>

                {fileName && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected file: <strong>{fileName}</strong>
                  </p>
                )}

                <input
                  type="file"
                  accept="application/pdf" // Only allow PDF uploads
                  className="hidden"
                  id="assignmentFile"
                  name="assignmentFile"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="border rounded p-4 mb-6">
              <h3 className="font-medium mb-2">ML Auto-Grading Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grading Rubric
                  </label>
                  <select name="rubric" className="w-full border rounded px-3 py-2">
                    <option>Default Scoring Rubric</option>
                    <option>Technical Writing Rubric</option>
                    <option>Research Paper Rubric</option>
                    <option>Code Analysis Rubric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback Style
                  </label>
                  <select name="feedbackStyle" className="w-full border rounded px-3 py-2">
                    <option>Balanced (Positive + Constructive)</option>
                    <option>Detailed Technical</option>
                    <option>Supportive Learning</option>
                    <option>Concise</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                onClick={() => setShowNewAssignmentForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900"> Assignments Tracker </h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm mr-4">
                ML Model Connected
              </span>
              {/* <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <span className="ml-2">Prof. Johnson</span>
                </div>
              </div> */}
              <button
                onClick={() => navigate('/teacher/dashboard')} // ✅ handle navigation
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                onClick={() => setActiveTab('assignments')}
              >
                Assignments
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'submissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                onClick={() => setActiveTab('submissions')}
              >
                Submissions & Grading
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        {renderMainContent()}
      </main>

      {/* Modals */}
      {showFeedbackForm && renderFeedbackForm()}

      {/* {renderAssignmentsTab()} */}
      {showNewAssignmentForm && renderNewAssignmentForm()}

    </div>
  );
};


export default AutoGrade;
