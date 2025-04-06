import React, { useState, useEffect, useRef } from 'react';
import {
  Bell, Calendar, Check, ChevronDown, ChevronUp,
  List, MessageSquare, Monitor, Settings, User, Video, X,
  FileText, Brain, Zap, Lightbulb, ScanLine, Upload, AlertCircle, InfoIcon, CheckSquare, BarChart
} from 'lucide-react';

import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts"; // ✅ Use recharts

import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import config from './config';

const TeacherDashboardNew = () => {

  //const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeFeature, setActiveFeature] = useState('autoGrading');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isProcessingGrades, setIsProcessingGrades] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
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

  const [performanceData, setPerformanceData] = useState([
    { name: 'Week 1', classAverage: 75, topPerformer: 90, overallImprovement: 65 },
    { name: 'Week 2', classAverage: 80, topPerformer: 92, overallImprovement: 70 },
    { name: 'Week 3', classAverage: 85, topPerformer: 95, overallImprovement: 78 },
    { name: 'Week 4', classAverage: 88, topPerformer: 96, overallImprovement: 82 },
    { name: 'Week 5', classAverage: 90, topPerformer: 98, overallImprovement: 85 }
  ]);

  const [extractedImages, setExtractedImages] = useState([]);


  const [students, setStudents] = useState([]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState("All Assignments");
  const [selectedImage, setSelectedImage] = useState(null);



  useEffect(() => {
    fetchAssignments();
  }, []);

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

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert('Please select a PDF file before submitting.');
      return;
    }

    try {
      // Extract title from file name (remove extension)
      const title = file.name.replace(/\.[^/.]+$/, "");
      const dueDate = new Date('2025-04-08T00:00:00.000Z');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', '');  // Leave empty
      formData.append('uploadedBy', '');   // Leave empty
      formData.append('dueDate', dueDate);
      formData.append('pdf', file);

      const response = await fetch(`${config.API_BASE_URL}/teacher/assignments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload assignment');
      }

      const data = await response.json();

      const newAssignment = {
        id: assignments.length + 1,
        title: title,
        dueDate: dueDate,
        status: 'active',
        totalSubmissions: 0,
        pendingGrading: 0
      };

      setAssignments([...assignments, newAssignment]);
      alert('Assignment uploaded successfully!');

      await fetchExtractedImages(data._id);
      // Reset file selection
      setSelectedFile(null);
      setFileName('');
    } catch (error) {
      console.error('Error uploading assignment:', error);
      alert('Failed to upload assignment.');
    }
  };

  const fetchExtractedImages = async (assignmentId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/teacher/assignments/${assignmentId}/images`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch extracted images');
      }

      const data = await response.json();
      setExtractedImages(data.images || []);
    } catch (error) {
      console.error('Error fetching extracted images:', error);
      alert('Failed to fetch extracted images.');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleInputChange = (e) => {
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload assignment');
      }

      const data = await response.json();


      const newAssignment = {
        id: assignments.length + 1,
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

  const handleSelect = (submissionId) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId) ? prev.filter(id => id !== submissionId) : [...prev, submissionId]
    );
  };

  const handleBatchGrade = async () => {
    console.log("yooo")
    if (selectedSubmissions.length === 0) {
      toast.error("No submissions selected!");
      return;
    }
    setIsProcessingGrades(true);

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
      //toast.success("Batch grading completed!");
      const updatedSubmissions = submissions.map(sub => {
        const gradedSub = data.results.find(r => r.submissionId === sub._id);
        return gradedSub ? { ...sub, score: gradedSub.score, feedback: gradedSub.feedback } : sub;
      });

      console.log("updatedSubmissions", updatedSubmissions);
      //console.log("gradedSub", gradedSub);

      setSubmissions(updatedSubmissions);


      setShowFeedbackForm(true);
      setSelectedSubmissions([]);
      setSelectedStudent(selectedSubmissions);

      console.log("Before alert...");
      setTimeout(() => {
        alert("Auto-grading completed successfully!");
        console.log("After alert...");
      }, 100); // Delays alert by 100ms
      //alert("Auto-grading completed successfully!");
      //console.log("After alert...");
      //navigate("/auto-grading");
      //window.location.reload()
    } catch (err) {
      console.error("Batch grading error:", err);
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
    fetchAnalytics();
  }, []);

  const openPdfPreview = (assignmentId, title) => {
    setSelectedPdfUrl(`${config.API_BASE_URL}/teacher/assignments/${assignmentId}`);
    setSelectedAssignmentTitle(title);
    setShowPdfModal(true);
    // assignedAssignments
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdfUrl('');
    setSelectedAssignmentTitle('');
  };

  const renderNewAssignmentForm = () => {
    if (!showNewAssignmentForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Create New Assignment</h2>
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={() => setShowNewAssignmentForm(false)}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                value={formInputs.title}
                onChange={handleInputChange}
                className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2"
                placeholder="Enter a title for the assignment"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formInputs.description}
                onChange={handleInputChange}
                className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 h-24"
                placeholder="Enter detailed instructions for students..."
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formInputs.dueDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Points Possible
                </label>
                <input
                  type="number"
                  name="points"
                  className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Assignment File
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded p-4 text-center cursor-pointer hover:border-blue-600 transition"
                onClick={handleBrowseClick}>
                <Upload className="mx-auto h-8 w-8 text-gray-500" />
                <p className="mt-1 text-sm text-gray-400">
                  Drag and drop your assignment file, or <span
                    onClick={handleBrowseClick}
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    browse
                  </span>
                </p>

                {fileName && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected file: <strong>{fileName}</strong>
                  </p>
                )}

                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  id="assignmentFile"
                  name="assignmentFile"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="border border-gray-700 rounded p-4 mb-6 bg-gray-800">
              <h3 className="font-medium mb-2 text-gray-300">ML Auto-Grading Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Grading Rubric
                  </label>
                  <select name="rubric" className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2">
                    <option>Default Scoring Rubric</option>
                    <option>Technical Writing Rubric</option>
                    <option>Research Paper Rubric</option>
                    <option>Code Analysis Rubric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Feedback Style
                  </label>
                  <select name="feedbackStyle" className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2">
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
                className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800"
                onClick={() => setShowNewAssignmentForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
              >
                Create Assignment
              </button>
            </div>
          </form>
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
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">
              Feedback for {currentSubmission.studentEmail}
            </h2>
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={() => setShowFeedbackForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Current Score
            </label>
            <div className="flex items-center">
              <input
                type="text"
                className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 w-full"
                value={currentSubmission.score}
                readOnly
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Strengths
            </label>
            <textarea
              className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 h-20"
              placeholder="Mention the student's strengths..."
              defaultValue={
                currentSubmission.feedback && currentSubmission.feedback.length > 0
                  ? currentSubmission.feedback[0].strengths
                  : ""
              }
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Areas for Improvement
            </label>
            <textarea
              className="w-full border border-gray-700 bg-gray-800 text-gray-100 rounded px-3 py-2 h-20"
              placeholder="Mention areas the student can improve..."
              defaultValue={
                currentSubmission.feedback && currentSubmission.feedback.length > 0
                  ? currentSubmission.feedback[0].improvements
                  : ""
              }
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Generate AI Feedback Suggestions
            </label>
            <div className="border border-gray-700 rounded p-3 mb-3 bg-gray-800">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-gray-300">Feedback Suggestions</h4>
                <span className="text-xs text-gray-500">Using ML model</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <Check size={16} className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Good use of supporting evidence in section 2. The citations were well-integrated.</p>
                </div>
                <div className="flex items-start">
                  <AlertCircle size={16} className="text-amber-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">The conclusion lacks clear connection to the main thesis. Consider strengthening this relationship.</p>
                </div>
                <div className="flex items-start">
                  <Check size={16} className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Effective use of technical terminology throughout the paper.</p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-blue-800 text-blue-100 rounded text-sm">
                  Insert All
                </button>
                <button className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                  Regenerate
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                Structure & Organization
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                Content Depth
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                Technical Accuracy
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800"
              onClick={() => setShowFeedbackForm(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
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

  const handleAssignmentChange = (event) => {
    setSelectedAssignment(event.target.value);
  };

  // Correct filtering based on selected assignment ID (not title)
  const filteredSubmissions =
    selectedAssignment === "All Assignments"
      ? submissions
      : submissions.filter(
        (submission) => submission.assignmentId?.toString() === selectedAssignment._id
      );

  console.log("filteredSub", filteredSubmissions);

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'autoGrading':
        return (
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Info tip for teachers */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <InfoIcon size={20} className="text-purple-400 mr-2 mt-1" />
                <p className="text-purple-300">
                  Use this tab for <span className="font-semibold">typed assignments</span>. For handwritten assignments, please use the OCR Processing tab.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Create Assignments</h2>
              <div className="flex space-x-3">
                {/* New OCR redirect button */}
                <button
                  onClick={() => setActiveFeature('ocrProcessing')}
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center"
                >
                  <ScanLine size={18} className="mr-2" /> Go to OCR Processing
                </button>
                <button
                  onClick={() => setShowNewAssignmentForm(true)}
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                  <Zap size={18} className="mr-2" /> Create New Assignment
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-300">Title</th>
                    <th className="px-4 py-2 text-left text-gray-300">Due Date</th>
                    <th className="px-4 py-2 text-left text-gray-300">Status</th>
                    <th className="px-4 py-2 text-left text-gray-300">Submissions</th>
                    <th className="px-4 py-2 text-left text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment.id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3 font-medium text-white">
                        <button
                          onClick={() => openPdfPreview(assignment._id, assignment.title)}
                          className="text-blue-400 hover:underline font-semibold"
                        >
                          {assignment.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{assignment.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${assignment.status === 'active'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-gray-800 text-gray-400'}`}>
                          {assignment.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-gray-300">{assignment.totalSubmissions} total</span>
                          {assignment.pendingGrading > 0 && (
                            <span className="text-amber-400 text-sm">{assignment.pendingGrading} pending grading</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 bg-blue-900 text-blue-300 rounded text-sm"
                            onClick={() => setActiveFeature('submissions')}
                          >
                            View Submissions
                          </button>
                          <button className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm">
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

      case 'submissions':
        return (
          <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Student Submissions</h2>
              <div className="flex space-x-3">
                <select
                  className="border border-gray-700 bg-gray-800 text-white rounded px-3 py-2"
                  value={selectedAssignment}
                  onChange={handleAssignmentChange}
                >
                  <option value="All Assignments">All Assignments</option>
                  {assignments.map((assignment) => (
                    <option key={assignment._id} value={assignment._id}>
                      {assignment.title}
                    </option>
                  ))}
                </select>

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                  onClick={handleBatchGrade}
                  disabled={(!selectedSubmissions || selectedSubmissions.length === 0) && isProcessingGrades}
                >
                  {isProcessingGrades ? (
                    <>
                      <span className="mr-2 text-gray-300">Processing</span>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </>
                  ) : (
                    'Auto Grade Submissions'
                  )}
                </button>
              </div>
            </div>

            {/* Display Filtered Submissions */}


            <table className="min-w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 border border-gray-700 text-gray-300">Select</th>
                  <th className="px-4 py-2 border border-gray-700 text-gray-300">Student</th>
                  <th className="px-4 py-2 border border-gray-700 text-gray-300">Submission Date</th>
                  <th className="px-4 py-2 border border-gray-700 text-gray-300">Score</th>
                  <th className="px-4 py-2 border border-gray-700 text-gray-300">Feedback</th>
                  <th className="px-4 py-2 border border-gray-700 text-gray-300">Status</th>
                  <th className="px-4 py-2 border border-gray-700 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) =>
                  assignment.specificSubmission.map((submission) => (
                    <tr key={submission._id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 bg-gray-900 border-gray-700 rounded"
                          checked={selectedSubmissions.includes(submission._id)}
                          onChange={() => handleSelect(submission._id)}
                        />
                      </td>

                      <td className="px-4 py-3 text-white">
                        {submission.studentEmail ? submission.studentEmail.split("@")[0] : "Unknown"}
                      </td>

                      <td className="px-4 py-3 text-gray-300">
                        {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "N/A"}
                      </td>

                      <td className="px-4 py-3 w-40">
                        {submission.score !== undefined ? (
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-700 rounded-full h-3">
                              <div
                                className="bg-blue-500 h-3 rounded-full"
                                style={{ width: `${submission.score}%` }}>
                              </div>
                            </div>
                            <span className="ml-2 text-white text-sm">{submission.score}%</span>
                          </div>
                        ) : (
                          <span className="text-white">Not graded yet</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {submission.submittedAt && (
                          <button
                            className="bg-gray-800 text-gray border border-gray-600 px-4 py-2 rounded hover:bg-gray-600"
                            onClick={() => {
                              handleGradeClick(students);
                            }}
                          >
                            {submission.feedback ? 'Show Feedback' : 'Add Feedback'}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={submission.submittedAt
                          ? "bg-green-700 text-white px-3 py-1 rounded hover:bg-green-600"
                          : "bg-red-700 text-white px-3 py-1 rounded hover:bg-red-600"}>
                          {submission.submittedAt ? "Submitted" : "Missing"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                          onClick={() => handleSelect(submission._id)}
                        >
                          {selectedSubmissions.includes(submission._id) ? "Deselect" : "Select"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case 'performanceAnalysis':
        console.log("hehe");

        if (isLoading) {
          return (
            <div className="bg-gray-900 rounded-lg shadow p-6 mb-6 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-300">Loading analytics...</span>
            </div>
          );
        }

        // Error state
        if (error) {
          return (
            <div className="bg-gray-900 rounded-lg shadow p-6 mb-6">
              <div className="text-red-400 flex items-center">
                <AlertCircle className="mr-2" />
                <span>Error loading analytics: {error}</span>
              </div>
            </div>
          );
        }

        // Ensure we have data before rendering
        if (!analyticsData) {
          return null;
        }

        return (
          <div className="bg-gray-900 p-6 rounded-lg space-y-6">
            <h1 className="text-3xl font-bold text-gray-100 mb-6">Real-Time Performance Dashboard</h1>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Performance Analysis & Trends</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-900/30 p-4 rounded">
                  <div className="text-3xl font-bold text-blue-400">85%</div>
                  <div className="text-sm text-blue-300">Class Average</div>
                </div>
                <div className="bg-green-900/30 p-4 rounded">
                  <div className="text-3xl font-bold text-green-400">92%</div>
                  <div className="text-sm text-green-300">Top Performer</div>
                </div>
                <div className="bg-purple-900/30 p-4 rounded">
                  <div className="text-3xl font-bold text-purple-400">78%</div>
                  <div className="text-sm text-purple-300">Improvement Rate</div>
                </div>
              </div>
            </div>

            {/* Performance Trend Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Performance Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#F9FAFB' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="classAverage"
                    stroke="#3B82F6"
                    activeDot={{ r: 8 }}
                    name="Class Average"
                  />
                  <Line
                    type="monotone"
                    dataKey="topPerformer"
                    stroke="#10B981"
                    name="Top Performer"
                  />
                  <Line
                    type="monotone"
                    dataKey="overallImprovement"
                    stroke="#8B5CF6"
                    name="Improvement Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Grade Distribution */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Grade Distribution</h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.gradeDistribution).map(([grade, percentage]) => (
                  <div key={grade} className="flex items-center">
                    <div className="w-12 text-gray-300">{grade}</div>
                    <div className="flex-grow bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${grade === 'A' ? 'bg-green-500' :
                          grade === 'B' ? 'bg-blue-500' :
                            grade === 'C' ? 'bg-yellow-500' :
                              'bg-red-500'
                          }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="ml-3 text-gray-300">{percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Submission Status</h3>
              <div className="flex justify-around">
                {Object.entries(analyticsData.submissionStatus).map(([status, percentage]) => (
                  <div key={status} className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${status === 'On Time' ? 'bg-green-900' :
                        status === 'Late' ? 'bg-yellow-900' :
                          'bg-red-900'
                        }`}
                    >
                      <span
                        className={`text-2xl font-bold ${status === 'On Time' ? 'text-green-400' :
                          status === 'Late' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <span className="mt-2 text-gray-400">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Key Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analyticsData.performanceMetrics).map(([metric, value]) => (
                  <div key={metric} className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-400 mb-2">{metric}</h4>
                    <p className="text-2xl font-bold text-gray-100">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );


      case 'ocrProcessing':
        return (
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Info tip for teachers */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <InfoIcon size={20} className="text-purple-400 mr-2 mt-1" />
                <p className="text-purple-300">
                  Use this tab for <span className="font-semibold">handwritten assignments</span>. For typed assignments, please use the Upload Assignments tab.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Handwritten Document OCR</h2>
              {/* New Auto Grading redirect button */}
              <button
                onClick={() => setActiveFeature('autoGrading')}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <CheckSquare size={18} className="mr-2" /> Go to Auto Grading
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDocumentUpload}
              className="hidden"
              accept="image/*,.pdf"
            />
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 transition"
            >
              <ScanLine size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Click to upload handwritten document</p>
            </div>

            {extractedImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Extracted Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {extractedImages.map((image, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded">
                      <img
                        src={`data:${image.contentType};base64,${image.base64}`}
                        alt={`Extracted image ${index + 1}`}
                        className="w-full h-48 object-contain rounded cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />

                      <p className="text-gray-300 mt-2 text-sm">Image {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-gray-950 text-gray-300 w-64">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">AI Teaching Assistant</h1>
          <nav>
            <ul className="space-y-2">
              {[
                { id: 'autoGrading', icon: <Zap size={20} />, text: 'Upload Assignments' },
                { id: 'submissions', icon: <Brain size={20} />, text: 'Auto Grading and Feedback' },
                { id: 'performanceAnalysis', icon: <BarChart size={20} />, text: 'Performance Analysis' },
                { id: 'ocrProcessing', icon: <FileText size={20} />, text: 'OCR Processing' }
              ].map(item => (
                <li key={item.id}>
                  <button
                    className={`flex items-center w-full px-4 py-3 rounded hover:bg-gray-800 ${activeFeature === item.id ? 'bg-blue-900/50' : ''}`}
                    onClick={() => setActiveFeature(item.id)}
                  >
                    <span className={`mr-3 ${activeFeature === item.id ? 'text-blue-400' : 'text-gray-400'}`}>{item.icon}</span>
                    <span className={activeFeature === item.id ? 'text-blue-300' : 'text-gray-300'}>{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderFeatureContent()}
      </div>
      <div>
        {showFeedbackForm && renderFeedbackForm()}
      </div>
      <div>
        {/* {renderAssignmentsTab()} */}
        {showNewAssignmentForm && renderNewAssignmentForm()}
      </div>
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
      {selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <div className="relative max-w-4xl w-full px-4">
      <button
        className="absolute top-2 right-2 text-white text-2xl font-bold"
        onClick={() => setSelectedImage(null)}
      >
        &times;
      </button>
      <img
        src={`data:${selectedImage.contentType};base64,${selectedImage.base64}`}
        alt="Fullscreen"
        className="max-h-[90vh] w-full object-contain rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking image
      />
    </div>
  </div>
)}

    </div>

  );
};

export default TeacherDashboardNew;