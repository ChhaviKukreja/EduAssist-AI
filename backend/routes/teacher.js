require('dotenv').config
const express = require("express");
const { Student, Teacher, Assignment, Submission } = require("../db")
const teacherMiddleware = require("../middleware/teacher");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { z } = require("zod");
const cors = require("cors");
router.use(cors());

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;


const multer = require('multer');
const storage = multer.memoryStorage(); // stores file in memory
const upload = multer({ storage: storage });

const bcrypt = require("bcrypt");

const signupSchema = z.object({
    firstName: z.string().min(2, "First name must have at least 2 characters"),
    lastName: z.string().min(2, "Last name must have at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string().min(8),
    role: z.enum(["teacher", "student"]),
    //   agreedToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Terms of Service" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});



router.post("/signup", async function (req, res) {
    try {
        const { firstName, lastName, email, password, role } = signupSchema.parse(req.body);


        if (role === "teacher") {
            const existingUser = await Teacher.findOne({ email });
            // console.log(existingUser);
            if (existingUser) {
                return res.status(400).json({ msg: "User already exists" });
            }
            else {
                await Teacher.create({ firstName, lastName, email, password, role });
            }
        } else {
            const existingUser = await Student.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: "User already exists" });
            }
            else {
                await Student.create({ firstName, lastName, email, password, role });
            }

        }

        const token = jwt.sign({ email, role }, JWT_SECRET);
        res.json({ msg: "User created successfully", token });

    } catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
});


router.post("/signin", async function (req, res) {
    try {
        const { email, password } = signinSchema.parse(req.body);

        // Check if user exists in Teacher or Student collection
        const user = await Teacher.findOne({ email, password }) ||
            await Student.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email or password" });
        }

        // Generate JWT token with user role
        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET);

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
});


router.get("/auth/check", teacherMiddleware, (req, res) => {
    res.status(200).json({ username: req.username }); // Send back the authenticated user's details
});

// Upload Assignment
router.post("/assignments", teacherMiddleware, upload.single('pdf'), async (req, res) => {
    const { title, description, dueDate } = req.body;
    console.log("hello1")
    try {
        console.log("inside try");
        const newAssignment = new Assignment({
            title, description, dueDate,
            uploadedBy: req.email,
            pdf: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });
        console.log("Assignment created", newAssignment);
        await newAssignment.save();
        console.log("Assignment saved")

        const assignmentId = newAssignment._id;

        const updateResult = await Student.updateMany({}, { $push: { todoAssignments: assignmentId } });

        //console.log("Update result:", updateResult);

        if (updateResult.nModified === 0) {
            throw new Error("Failed to update assignment with the new submission.");
        }
        res.status(201).json(newAssignment);

    } catch (error) {
        res.status(500).json({ error: "Failed to create assignment" });
    }
});

router.get("/assignments", async (req, res) => {
    console.log("outside try");
    try {
        console.log("called");
        const assignments = await Assignment.find();
        // console.log("assignments", assignments);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});

router.get("/submissions", async (req, res) => {
    try {
        const submissions = await Assignment.find().populate("specificSubmission");
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});

const pdfParse = require('pdf-parse');

// Batch auto-grade multiple submissions
router.post("/grade/batch", async (req, res) => {
    try {
        console.log("Inside batch grading route");
        const { submissionIds } = req.body;

        if (!submissionIds || submissionIds.length === 0) {
            return res.status(400).json({ message: "No submissions provided" });
        }

        const assignments = await Assignment.find({ specificSubmission: { $in: submissionIds } })
            .populate("specificSubmission");

        if (!assignments.length) {
            return res.status(404).json({ message: "No assignments found" });
        }

        const teacherPdfBase64 = assignments[0].pdf.data.toString('base64');
        const teacherPdfBuffer = Buffer.from(teacherPdfBase64, 'base64');
        const teacherPdfData = await pdfParse(teacherPdfBuffer);
        const teacherText = teacherPdfData.text.trim();

        console.log("Extracted Teacher's Assignment (Questions):", teacherText);

        let submissions = [];
        assignments.forEach(assignment => {
            submissions.push(...assignment.specificSubmission.filter(sub => submissionIds.includes(sub._id.toString())));
        });

        console.log("Found submissions:", submissions);

        if (!submissions.length) {
            return res.status(404).json({ message: "No submissions found" });
        }

        const gradingPromises = submissions.map(async (submission) => {
            try {
                const studentPdfBase64 = submission.pdf.data.toString('base64');
                const studentPdfBuffer = Buffer.from(studentPdfBase64, 'base64');
                const studentPdfData = await pdfParse(studentPdfBuffer);
                const studentText = studentPdfData.text.trim();

                console.log("Extracted Student's Response:", studentText);

                const response = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are an AI grader. Grade the student's response based on the provided assignment questions.
                                \n**Assignment Questions (from Teacher)**:\n${teacherText}\n\n**Student's Response**:\n${studentText}\n\nEvaluate the response based on relevance, completeness, and correctness.\n\n**Output format**:\nScore: (numeric value between 0-100)\nStrengths: (brief text)\nAreas for Improvement: (brief text)`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.5,
                            maxOutputTokens: 300
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error(`Failed to grade submission: ${response.statusText}`);
                }

                const data = await response.json();
                const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

                const parsedOutput = output.match(/Score:\s*(\d+)/);
                const strengths = output.match(/Strengths:\s*(.*)/);
                const improvements = output.match(/Areas for Improvement:\s*(.*)/);

                submission.score = parsedOutput ? parseInt(parsedOutput[1]) : 0;
                submission.feedback = {
                    strengths: strengths ? strengths[1] : "No feedback provided.",
                    improvements: improvements ? improvements[1] : "No areas for improvement mentioned."
                };

                await submission.save();

                return {
                    studentEmail: submission.studentEmail,
                    assignmentId: submission.assignmentId,
                    submittedAt: submission.submittedAt,
                    status: submission.status,
                    pdf: {
                        data: studentPdfBase64,
                        contentType: submission.pdf.contentType
                    },
                    score: submission.score,
                    feedback: submission.feedback
                };

            } catch (error) {
                console.error(`Error grading submission ${submission._id}:`, error);
                return { submissionId: submission._id, error: "Failed to grade submission" };
            }
        });

        const gradedSubmissions = await Promise.all(gradingPromises);
        res.status(200).json({ gradedSubmissions });

    } catch (error) {
        console.error("Error in /grade/batch route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/analytics', teacherMiddleware, async (req, res) => {
  try {
    console.log("insideeee")
    // Fetch all assignments and submissions for the authenticated teacher
    const assignments = await Assignment.find();
    const submissions = await Submission.find({
      assignmentId: { $in: assignments.map(a => a._id) }
    });
    // Calculate Grade Distribution
    const calculateGradeDistribution = (submissions) => {
      const gradeRanges = {
        'A': { min: 90, max: 100 },
        'B': { min: 80, max: 89 },
        'C': { min: 70, max: 79 },
        'D/F': { min: 0, max: 69 }
      };

      const distribution = {
        'A': 0,
        'B': 0,
        'C': 0,
        'D/F': 0
      };

      submissions.forEach(submission => {
        const score = submission.score;
        if (score >= gradeRanges['A'].min) distribution['A']++;
        else if (score >= gradeRanges['B'].min) distribution['B']++;
        else if (score >= gradeRanges['C'].min) distribution['C']++;
        else distribution['D/F']++;
      });

      // Convert to percentages
      const total = submissions.length;
      Object.keys(distribution).forEach(grade => {
        distribution[grade] = Math.round((distribution[grade] / total) * 100);
      });

      return distribution;
    };

    // Calculate Submission Status
    const calculateSubmissionStatus = (assignments, submissions) => {
      const now = new Date();
      const status = {
        'On Time': 0,
        'Late': 0,
        'Missing': 0
      };

      assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const assignmentSubmissions = submissions.filter(
          sub => sub.assignmentId.toString() === assignment._id.toString()
        );

        const totalStudents = 3; // You might want to replace this with actual total students

        assignmentSubmissions.forEach(submission => {
          const submittedDate = new Date(submission.submittedAt);
          if (submittedDate <= dueDate) status['On Time']++;
          else status['Late']++;
        });

        // Calculate missing submissions
        const missingSubmissions = totalStudents - assignmentSubmissions.length;
        status['Missing'] += missingSubmissions;
      });

      // Convert to percentages
      const total = submissions.length + status['Missing'];
      Object.keys(status).forEach(key => {
        status[key] = Math.round((status[key] / total) * 100);
      });

      return status;
    };

    // Calculate Performance Metrics
    const calculatePerformanceMetrics = (submissions) => {
      if (submissions.length === 0) {
        return {
          'Average Score': 'N/A',
          'Total Submissions': '0',
          'Highest Score': 'N/A',
          'Lowest Score': 'N/A'
        };
      }

      const scores = submissions.map(sub => sub.score);
      
      return {
        'Average Score': (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
        'Total Submissions': submissions.length.toString(),
        'Highest Score': Math.max(...scores).toString(),
        'Lowest Score': Math.min(...scores).toString()
      };
    };

    // Compile analytics
    const analytics = {
      gradeDistribution: calculateGradeDistribution(submissions),
      submissionStatus: calculateSubmissionStatus(assignments, submissions),
      performanceMetrics: calculatePerformanceMetrics(submissions)
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics calculation error:', error);
    res.status(500).json({ 
      message: 'Error calculating analytics', 
      error: error.message 
    });
  }
});

module.exports = router;