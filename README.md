# EduAssist

## Empowering Educators, Enhancing Learning

## Overview

EduAssist is an AI-powered educational assistant designed to reduce the burden on overworked teachers while providing students with high-quality, personalized feedback. By automating the grading process and generating constructive, individualized feedback, EduAssist enables educators to focus more on teaching and mentoring rather than administrative tasks.

## The Problem We Solve

Teachers in schools, coaching centers, and colleges face overwhelming workloads when providing individualized feedback to students in large classrooms. Manual grading and feedback processes consume valuable time, particularly affecting educators in under-resourced settings with high teacher-to-student ratios. This results in students missing out on the personalized guidance crucial for their academic development and success.

## Our Solution

EduAssist leverages advanced AI to:

- **Automate Assignment Grading**: Rapidly assess student work across multiple subjects and formats
- **Generate Personalized Feedback**: Provide tailored, constructive feedback highlighting strengths and areas for improvement
- **Track Student Progress**: Monitor learning trajectories and identify knowledge gaps for targeted intervention
- **Support Multiple Languages**: Ensure accessibility for diverse student populations
- **Maintain High Security Standards**: Protect student data and privacy

## Our Vision: Transforming Educational Feedback
EduAssist aims to revolutionize how educators provide student feedback, addressing one of education's most persistent challenges. Our solution aspires to:

- **Reclaim Teacher Time**: Free educators from time-consuming grading tasks, potentially saving 10+ hours weekly that can be redirected to high-impact teaching
- **Democratize Quality Feedback**: Ensure every student receives timely, meaningful guidance regardless of class size or institution resources
- **Bridge Educational Divides**: Level the playing field between well-resourced and under-resourced schools by making personalized feedback universally accessible
- **Empower Data-Driven Teaching**: Provide educators with actionable insights into student progress and learning patterns
- **Transform Learning Culture**: Foster student growth through consistent, constructive feedback that builds confidence and self-improvement skills

As a pioneering solution in educational technology, EduAssist represents a new wave in how AI can address fundamental challenges in education - not by replacing teachers, but by amplifying their impact and extending their reach to every student who needs guidance.

## Alignment with UN SDG 4: Quality Education

EduAssist directly contributes to UN Sustainable Development Goal 4 by:

- **Ensuring inclusive and equitable quality education**: Providing consistent, high-quality feedback to all students regardless of class size or school resources
- **Promoting lifelong learning opportunities**: Offering constructive guidance that builds student confidence and autonomous learning skills
- **Increasing the supply of qualified teachers**: Enhancing teacher effectiveness by freeing up time for professional development and meaningful student interaction
- **Supporting education in developing regions**: Offering affordable options for schools with limited resources and high student-to-teacher ratios
- **Improving educational outcomes**: Enabling data-driven insights for personalized learning paths

## Features

- **Smart Assignment Analysis**: Processes essays, math problems, code, science reports, and creative projects
- **Contextual Feedback Engine**: Provides suggestions tailored to individual student abilities and learning styles
- **Progress Dashboard**: Visualizes individual and class-wide learning trends
- **Customizable Rubrics**: Allows teachers to set specific grading criteria
- **Integration Capabilities**: Works with popular LMS platforms including Google Classroom, Canvas, and Moodle
- **Offline Mode**: Functions in areas with limited internet connectivity

## Getting Started

Visit [https://edu-assist-ai-f.vercel.app/](https://edu-assist-ai-f.vercel.app/) to create an account and begin your free trial.

## Tech Stack
Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

OCR: Google Cloud Vision (for handwritten inputs)

Storage: MongoDB (base64-encoded PDFs)

## Setup Instructions

### Prerequisites
- Node.js installed on your machine
- MongoDB installed locally or access to a MongoDB cloud database

### Steps to Run Locally
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd EduAssist-AI
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
   ```env
     PORT=5000
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```
5. Start the development server:
   ```bash
   npm start
   ```
6. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

---


## Support

For technical assistance or to provide feedback:
- Email: support@eduassist.io
- Help Center: [help.eduassist.io](https://help.eduassist.io)
- Community Forum: [community.eduassist.io](https://community.eduassist.io)

## Join Our Mission

EduAssist is committed to creating more equitable educational experiences worldwide. By reducing administrative burdens on teachers and increasing access to quality feedback, we're helping build a future where every student receives the individualized attention they deserve.

## License

EduAssist © 2025. All rights reserved.
