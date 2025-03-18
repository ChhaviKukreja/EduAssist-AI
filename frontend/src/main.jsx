import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Import styles
import "./index.css";
import "./landingPage/land.css";
import "./student/student-dashboard.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
