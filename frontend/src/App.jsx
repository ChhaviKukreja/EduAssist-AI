import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import LandingPage from "./landingPage/land.jsx"; // Ensure correct import
import TeacherDashboard from './teacher/teacher-dashboard';
import StudentDashboard from './student/student-dashboard';
//import TeacherDashboard from './teacher/dashboard-updated';
import AutoGrade from './teacher/auto-grading';

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
    </Routes>
  );
}

export default App;
