const express = require("express");
const { Submission, Student, Assignment } = require("../db")
const studentMiddleware = require("../middleware/student");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { z } = require("zod");
const cors = require("cors");
router.use(cors());

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
        //console.log("inside try");
        const { email, password } = signinSchema.parse(req.body);
        //console.log("email and pwd", email, password);

        // Check if user exists in Teacher or Student collection
        const user = await Student.findOne({ email, password });
        //console.log("user", user);

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email or password" });
        }

        // Generate JWT token with user role
        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET);
        //console.log("token", token);

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
});


router.get("/auth/check", studentMiddleware, (req, res) => {
    res.status(200).json({ username: req.email }); // Send back the authenticated user's details
});


router.get('/download-submission/:submissionId', async (req, res) => {
    try {
        const { submissionId } = req.params;

        // Find the submission by ID
        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Set response headers for file download
        res.set({
            'Content-Type': submission.pdf.contentType,
            'Content-Disposition': `attachment; filename=submission-${submissionId}.pdf`
        });

        // Send the binary data as a response
        res.send(submission.pdf.data);
    } catch (error) {
        console.error('Error downloading submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/assignments', studentMiddleware, async (req, res) => {
    try {
        console.log("inside try");
        const student = await Student.findOne({ email: req.email }).populate('todoAssignments');
        //console.log("stutodo", student.todoAssignments);
        res.json(student.todoAssignments);
    } catch (error) {
        console.error("Error fetching assigned assignments:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');

router.get('/assignments/:id', async (req, res) => {
    try {
        console.log("Fetching PDF for assignment ID:", req.params.id);

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (!assignment.pdf || !assignment.pdf.data) {
            return res.status(400).json({ message: "PDF not available" });
        }

        res.setHeader('Content-Type', assignment.pdf.contentType);
        res.setHeader('Content-Disposition', 'inline; filename="assignment.pdf"');
        res.send(assignment.pdf.data);

    } catch (error) {
        console.error("Error fetching PDF:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/submissions/:id', async (req, res) => {
    try {
        console.log("Fetching PDF for submission ID:", req.params.id);

        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (!submission.pdf || !submission.pdf.data) {
            return res.status(400).json({ message: "PDF not available" });
        }

        res.setHeader('Content-Type', submission.pdf.contentType);
        res.setHeader('Content-Disposition', 'inline; filename="submission.pdf"');
        res.send(submission.pdf.data);

    } catch (error) {
        console.error("Error fetching PDF:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/submit-assignment/:username/:assignmentId/:title", upload.single("pdf"), async (req, res) => {
    try {
        const { username, assignmentId, title } = req.params;

        if (!username || !assignmentId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const student = await Student.findOne({ email: username });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Remove assignment from todoAssignments
        student.todoAssignments = student.todoAssignments.filter(id => id.toString() !== assignmentId);

        // Create a new submission entry
        const newSubmission = new Submission({
            studentEmail: username,
            title,
            assignmentId,
            pdf: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
        });
        await newSubmission.save();

        // Push submission to student's submittedAssignments
        student.submittedAssignments.push(newSubmission._id);
        await student.save();

        // const updateResult = await Assignment.updateOne(
        //     { _id: newSubmission._id },
        //     { "$push": { specificSubmission: newSubmission._id } }
        //   );

        assignment.specificSubmission.push(newSubmission._id);
        await assignment.save();


        // Log the result of the update
        //   console.log("Update result:", updateResult);

        //   if (updateResult.nModified === 0) {
        //     throw new Error("Failed to update organiser with the new event.");
        //   }

        res.status(200).json({ message: "Assignment submitted successfully", submissionId: newSubmission._id });
    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/submissions', studentMiddleware, async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.email })
            .populate({
                path: 'submittedAssignments',
                populate: {
                    path: 'assignmentId', // This will populate the assignment details inside each submission
                }
            });

        res.json(student.submittedAssignments);
    } catch (error) {
        console.error("Error fetching submitted assignments:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/assignment/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        res.json({ title: assignment.title });
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;