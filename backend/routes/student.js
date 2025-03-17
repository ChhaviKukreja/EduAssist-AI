const express = require ("express");
const { Submission } = require("../db")
const router = express.Router();

router.post("/submissions", studentMiddleware, upload.single('pdf'), async (req, res) => {
    const { assignmentId, studentId } = req.body;

    try {
        const submission = new StudentSubmission({
            assignmentId,
            studentId,
            pdf: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await submission.save();
        res.status(201).json({ message: "Submission uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload submission" });
    }
});


module.exports = router;