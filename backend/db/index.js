require('dotenv').config();
const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;
console.log("Mongo uri is -> ", mongoUri);
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 60000, // 60 seconds
  socketTimeoutMS: 60000,  // 60 seconds
});

const teacherSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password stored here
    role: { type: String, enum: ["teacher", "student"], required: true }
    // agreedToTerms: { type: Boolean, required: true },
  });
  
  const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student"], required: true },
    todoAssignments: [{
        type:mongoose.Schema.Types.ObjectID,
        ref:"Assignment"  
    }],
    submittedAssignments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Submission"
    }]
  });

const assignmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    uploadedBy: String, // Teacher ID
    dueDate: Date,
    pdf: {
      data: Buffer,
      contentType: String
    },
    specificSubmission: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Submission"
    }]
});

const submissionSchema = new mongoose.Schema({  
    studentEmail: String,
    assignmentId: mongoose.Schema.Types.ObjectId,
    submittedAt: { type: Date, default: Date.now },
    status: String,
    pdf: {
      data: Buffer,
      contentType: String
    },
    score: Number,
    feedback: [{
      strengths: String,
      improvements: String
    }]
});

const Submission = mongoose.model("Submission", submissionSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

module.exports = {
    Teacher,
    Student,
    Assignment,
    Submission
}