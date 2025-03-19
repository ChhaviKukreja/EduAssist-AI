import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import LandingPage from "./landingPage/land.jsx"; // Ensure correct import
import TeacherDashboard from './teacher/teacher-dashboard';
import StudentDashboard from './student/student-dashboard';
//import TeacherDashboard from './teacher/dashboard-updated';
import AutoGrade from './teacher/auto-grading';
import assignmentsTab from "./student/assignmentTest.jsx";
import calendarTab from "./student/calendar.jsx";
import chatsTab from "./student/chatMessage.jsx";
import cheatsheetsTab from "./student/cheatSheets.jsx";
import doubtsTab from "./student/doubtSolving.jsx";
import focusTab from "./student/focusTools.jsx";
import notesTab from "./student/notes.jsx";
import recommendationsTab from "./student/recommendation.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/autograde" element={<AutoGrade />} />
      <Route path="/assignments" element={<assignmentsTab />} />
      <Route path="/calendar" element={<calendarTab />} />
      <Route path="/chat" element={<chatsTab />} />
      <Route path="/cheatsheet" element={<cheatsheetsTab />} />
      <Route path="/doubt" element={<doubtsTab />} />
      <Route path="/focus" element={<focusTab />} />
      <Route path="/notes" element={<notesTab />} />
      <Route path="/recommendation" element={<recommendationsTab />} />
    </Routes>
  );
}

export default App;
