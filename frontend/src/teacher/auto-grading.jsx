import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AutoGrade = () => {
  // State management
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('assignments');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
  const [isProcessingGrades, setIsProcessingGrades] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [formInputs, setFormInputs] = useState({
    title: '',
    description: '',
    uploadedBy: '',
    dueDate: ''
  });

  // Sample data
  const [assignments, setAssignments] = useState([]);

  const [students, setStudents] = useState([
    { id: 1, name: 'Alex Johnson', grade: 'A', performance: 92, submitted: true, feedback: false, submissionDate: '2025-03-12' },
    { id: 2, name: 'Jamie Smith', grade: 'B+', performance: 87, submitted: true, feedback: true, submissionDate: '2025-03-11' },
    { id: 3, name: 'Taylor Brown', grade: 'C', performance: 74, submitted: true, feedback: false, submissionDate: '2025-03-13' },
    { id: 4, name: 'Morgan Davis', grade: 'A-', performance: 90, submitted: true, feedback: true, submissionDate: '2025-03-10' },
    { id: 5, name: 'Jordan Wilson', grade: '', performance: 0, submitted: false, feedback: false, submissionDate: null },
    { id: 6, name: 'Casey Miller', grade: 'B', performance: 83, submitted: true, feedback: false, submissionDate: '2025-03-12' },
  ]);


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

      const response = await fetch('http://localhost:5000/teacher/assignments', {
        method: 'POST',
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
      const response = await fetch("http://localhost:5000/teacher/assignments", {
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

  const handleAutoGradeClick = () => {
    setIsProcessingGrades(true);
    // Simulating API call to ML model for auto-grading
    setTimeout(() => {
      setIsProcessingGrades(false);
      // Update students with auto-graded results
      setStudents(students.map(student =>
        student.submitted && !student.grade ?
          { ...student, grade: generateRandomGrade(), performance: Math.floor(Math.random() * 30) + 70 } :
          student
      ));
    }, 2000);
  };

  const generateRandomGrade = () => {
    const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
    return grades[Math.floor(Math.random() * 6)]; // Biased toward better grades
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

  const renderAssignmentsTab = () => {
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

  // const renderNewAssignmentForm = () => {
  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  //       <div className="bg-white p-6 rounded-lg w-96 relative">
  //         <button
  //           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
  //           onClick={() => setShowNewAssignmentForm(false)}
  //         >
  //           &times;
  //         </button>
  //         <h2 className="text-lg font-semibold mb-4">Create New Assignment</h2>
  //         <form onSubmit={handleSubmit}>
  //           <div className="mb-4">
  //             <label className="block mb-1 font-medium">Title</label>
  //             <input
  //               type="text"
  //               name="title"
  //               value={formInputs.title}
  //               onChange={handleInputChange}
  //               className="w-full px-3 py-2 border rounded"
  //               required
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block mb-1 font-medium">Description</label>
  //             <textarea
  //               name="description"
  //               value={formInputs.description}
  //               onChange={handleInputChange}
  //               className="w-full px-3 py-2 border rounded"
  //               rows={3}
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block mb-1 font-medium">Uploaded By</label>
  //             <input
  //               type="text"
  //               name="uploadedBy"
  //               value={formInputs.uploadedBy}
  //               onChange={handleInputChange}
  //               className="w-full px-3 py-2 border rounded"
  //               required
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block mb-1 font-medium">Due Date</label>
  //             <input
  //               type="date"
  //               name="dueDate"
  //               value={formInputs.dueDate}
  //               onChange={handleInputChange}
  //               className="w-full px-3 py-2 border rounded"
  //               required
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label className="block mb-1 font-medium">Upload PDF</label>
  //             <input
  //               type="file"
  //               accept=".pdf"
  //               onChange={handleFileChange}
  //               className="w-full"
  //               required
  //             />
  //             {fileName && <p className="text-sm text-gray-500 mt-1">{fileName}</p>}
  //           </div>
  //           <div className="flex justify-end">
  //             <button
  //               type="submit"
  //               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  //             >
  //               Submit
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // };

  //   return (
  //     <div className="p-6 bg-gray-100 min-h-screen">
  //       {renderAssignmentsTab()}
  //       {showNewAssignmentForm && renderNewAssignmentForm()}
  //     </div>
  //   );
  // };


  const renderSubmissionsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Student Submissions</h2>
          <div className="flex space-x-3">
            <select className="border rounded px-3 py-2">
              <option>All Assignments</option>
              {assignments.map(assignment => (
                <option key={assignment.id}>{assignment.title}</option>
              ))}
            </select>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleAutoGradeClick}
              disabled={isProcessingGrades}
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Submission Date</th>
                <th className="px-4 py-2 text-left">Grade</th>
                <th className="px-4 py-2 text-left">Performance</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.submissionDate || 'N/A'}</td>
                  <td className="px-4 py-3">{student.submitted ? student.grade || 'Pending' : 'Not Submitted'}</td>
                  <td className="px-4 py-3">
                    {student.submitted ? (
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${student.performance}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{student.performance}%</span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {student.submitted ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        Submitted
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {student.submitted && (
                      <button
                        className={`px-3 py-1 rounded text-sm ${student.feedback ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}
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
    );
  };

  const renderAnalyticsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Assignment Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Grade Distribution</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <span className="w-8">A</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="ml-2">40%</span>
              </div>
              <div className="flex items-center">
                <span className="w-8">B</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="ml-2">35%</span>
              </div>
              <div className="flex items-center">
                <span className="w-8">C</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="ml-2">15%</span>
              </div>
              <div className="flex items-center">
                <span className="w-8">D/F</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="ml-2">10%</span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Submission Status</h3>
            <div className="flex items-center justify-center h-32">
              <div className="flex flex-col items-center mx-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg font-semibold">83%</span>
                </div>
                <span className="mt-2 text-sm">On Time</span>
              </div>
              <div className="flex flex-col items-center mx-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 text-lg font-semibold">7%</span>
                </div>
                <span className="mt-2 text-sm">Late</span>
              </div>
              <div className="flex flex-col items-center mx-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-lg font-semibold">10%</span>
                </div>
                <span className="mt-2 text-sm">Missing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the feedback form modal
  const renderFeedbackForm = () => {
    if (!showFeedbackForm || !selectedStudent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Feedback for {selectedStudent.name}
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
              Current Grade
            </label>
            <div className="flex items-center">
              <select className="border rounded px-3 py-2 w-24">
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
                <div className="w-full bg-gray-200 rounded-full h-2.5 w-64">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${selectedStudent.performance}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{selectedStudent.performance}% Performance</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
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
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personalized Feedback
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 h-32"
              placeholder="Enter detailed feedback for the student..."
              defaultValue={selectedStudent.feedback ? "Great work on this assignment! Your analysis was thoughtful and showed good understanding of the concepts. Consider expanding on your conclusions in the next assignment." : ""}
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
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <span className="ml-2">Prof. Johnson</span>
                </div>
              </div>
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
      {renderFeedbackForm()}
      {/* {renderAssignmentsTab()} */}
      {showNewAssignmentForm && renderNewAssignmentForm()}

    </div>
  );
};


export default AutoGrade;
