const express =   require('express');
const bodyParser = require('body-parser');
// require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(cors({
    origin: "https://eduassistbackend-git-main-chhavikukrejas-projects.vercel.app/",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
  }));
app.use(express.json());
app.use(bodyParser.json());
const teacherRouter = require('./routes/teacher');
const studentRouter = require('./routes/student');

app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);


module.exports = app;
// const PORT = 5000;
// // server.on('request', app);
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });