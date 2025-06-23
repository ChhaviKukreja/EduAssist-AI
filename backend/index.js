const express =   require('express');
const bodyParser = require('body-parser');
// require('dotenv').config();
const cors = require("cors");
const app = express();

// const mongoUri = process.env.MONGO_URI;
//console.log("Mongo uri is -> ", mongoUri);
// mongoose.connect("mongodb+srv://padamgoelbt23cseds:dinesh12@cluster0.sxzib.mongodb.net/EduAssist-AI?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   connectTimeoutMS: 60000, // 60 seconds
//   socketTimeoutMS: 60000,  // 60 seconds
// });
// app.use(cors());
app.use(cors({
    origin: "https://eduassistbackend-chhavikukrejas-projects.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
  }));
app.use(express.json());
app.use(bodyParser.json());
const teacherRouter = require('./routes/teacher');
const studentRouter = require('./routes/student');

app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);

// app.get("/", (req, res) => {
//   res.send("EduAssist Backend is running!");
// });


module.exports = app;
// const PORT = 5000;
// // server.on('request', app);
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });