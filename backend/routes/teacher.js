const express = require ("express");
const { Assignment, Teacher } = require("../db")
const { Submission } = require("../db");
const teacherMiddleware = require("../middleware/teacher");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { z } = require("zod");
const cors = require("cors");
router.use(cors());

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
            else{
                await Teacher.create({ firstName, lastName, email, password, role });
            }
        } else {
            const existingUser = await Student.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: "User already exists" });
            }
            else{
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
router.post("/assignments", async (req, res) => {
    const { title, description, uploadedBy, dueDate } = req.body;
    console.log("hello1")
    try {
        console.log("inside try");
        const newAssignment = new Assignment({ title, description, uploadedBy, dueDate });
        console.log("Assignment created", newAssignment);
        await newAssignment.save();
        console.log("Assignment saved")
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(500).json({ error: "Failed to create assignment" });
    }
});

router.get("/assignments", async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});


// Batch Grade Assignments
router.post("/grade", async (req, res) => {
    try {
        const submissions = await Submission.find({ graded: false });

        if (submissions.length === 0) {
            return res.json({ message: "No pending submissions to grade" });
        }

        const gradedSubmissions = await Promise.all(
            submissions.map(async (submission) => {
                const response = await openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: "You are an AI teacher assistant grading assignments." },
                        { role: "user", content: `Grade this assignment and provide constructive feedback:\n\n${submission.content}` }
                    ]
                });

                const feedback = response.choices[0].message.content;
                const grade = feedback.includes("Excellent") ? "A" :
                              feedback.includes("Good") ? "B" :
                              feedback.includes("Needs Improvement") ? "C" : "D";

                submission.graded = true;
                submission.grade = grade;
                submission.feedback = feedback;
                await submission.save();

                return { studentName: submission.studentName, grade, feedback };
            })
        );

        res.json({ message: "Assignments graded", results: gradedSubmissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error grading assignments" });
    }
});

module.exports = router;