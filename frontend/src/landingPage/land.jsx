import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Book, Brain, FileText, BarChart3, MessageCircle, Search, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './land.css';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans">
      {/* Navigation Bar */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-gray-800 shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-cyan-400">EduGenius</Link>
          </div>
          <div className="hidden md:flex space-x-10">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition">Testimonials</a>
          </div>
          <div>
            <button 
              onClick={handleSignupClick}
              className="bg-cyan-600 text-white py-2 px-6 rounded-full hover:bg-cyan-700 transition mr-4"
            >
              Sign Up
            </button>
            <button 
              onClick={handleLoginClick}
              className="border border-cyan-600 text-cyan-400 py-2 px-6 rounded-full hover:bg-gray-800 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 leading-tight">
              Transform Teaching with 
              <span className="text-cyan-400"> AI-Powered</span> Assistance
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-md">
              Automate grading, provide personalized feedback, and save countless hours with our intelligent education platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleSignupClick}
                className="bg-cyan-600 text-white py-3 px-8 rounded-full hover:bg-cyan-700 transition flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-gray-800 text-cyan-400 py-3 px-8 rounded-full hover:bg-gray-700 transition">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/api/placeholder/600/400" 
              alt="AI Teaching Assistant Dashboard" 
              className="rounded-lg shadow-2xl border-4 border-gray-700"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100">Powerful Features for Modern Education</h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform helps teachers save time and improve student outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: AI-Based Assignment Grading */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="bg-cyan-800 p-3 rounded-lg inline-block">
                <FileText className="text-cyan-300 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-gray-100">AI-Based Assignment Grading</h3>
              <p className="mt-2 text-gray-400">
                Our AI scans written or typed assignments and automatically grades them, saving teachers hours of manual work.
              </p>
            </div>
            
            {/* Feature 2: Personalized Feedback Generator */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="bg-purple-800 p-3 rounded-lg inline-block">
                <MessageCircle className="text-purple-300 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-gray-100">Personalized Feedback Generator</h3>
              <p className="mt-2 text-gray-400">
                AI analyzes student work and provides detailed feedback on mistakes and areas for improvement.
              </p>
            </div>
            
            {/* Feature 3: Plagiarism & Grammar Checker */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="bg-green-800 p-3 rounded-lg inline-block">
                <Search className="text-green-300 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-gray-100">Plagiarism & Grammar Checker</h3>
              <p className="mt-2 text-gray-400">
                AI checks for plagiarism and analyzes grammar and clarity in student writing, encouraging originality.
              </p>
            </div>
            
            {/* Feature 4: Smart Quiz & Exam Evaluation */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="bg-red-800 p-3 rounded-lg inline-block">
                <Book className="text-red-300 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-gray-100">Smart Quiz & Exam Evaluation</h3>
              <p className="mt-2 text-gray-400">
                Teachers can upload quizzes and exams, and AI automatically grades them, reducing marking time.
              </p>
            </div>
            
            {/* Feature 5: Adaptive Learning Suggestions */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="bg-yellow-800 p-3 rounded-lg inline-block">
                <Brain className="text-yellow-300 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-gray-100">Adaptive Learning Suggestions</h3>
              <p className="mt-2 text-gray-400">
                AI recommends learning resources based on a student's weaknesses, providing personalized study materials.
              </p>
            </div>
            
            {/* Feature 6: Teacher Dashboard */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="bg-orange-800 p-3 rounded-lg inline-block">
                <BarChart3 className="text-orange-300 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-gray-100">Teacher Dashboard</h3>
              <p className="mt-2 text-gray-400">
                A comprehensive dashboard that shows student progress, strengths, and weaknesses over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100">How It Works</h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform simplifies the teaching process from start to finish
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-800 transition feature-card">
              <div className="bg-gray-700 inline-flex rounded-full p-3 mb-4">
                <span className="bg-cyan-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">Upload Assignments</h3>
              <p className="text-gray-400">
                Teachers upload assignments through our intuitive dashboard or integrate with existing systems.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-800 transition feature-card">
              <div className="bg-gray-700 inline-flex rounded-full p-3 mb-4">
                <span className="bg-cyan-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">AI Analysis</h3>
              <p className="text-gray-400">
                Our advanced AI analyzes student submissions for content, accuracy, and originality.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-800 transition feature-card">
              <div className="bg-gray-700 inline-flex rounded-full p-3 mb-4">
                <span className="bg-cyan-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-100">Review & Distribute</h3>
              <p className="text-gray-400">
                Teachers review automated grades and feedback before distributing them to students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100">What Educators Are Saying</h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
              Teachers love how our platform transforms their classroom experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="flex items-center mb-4">
                <img src="/api/placeholder/60/60" alt="Teacher" className="rounded-full border-2 border-gray-600" />
                <div className="ml-4">
                  <h4 className="font-semibold text-lg text-gray-100">Sarah Johnson</h4>
                  <p className="text-gray-400">High School English Teacher</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "This platform has saved me countless hours grading essays. The feedback it provides is surprisingly thorough and personalized."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="flex items-center mb-4">
                <img src="/api/placeholder/60/60" alt="Teacher" className="rounded-full border-2 border-gray-600" />
                <div className="ml-4">
                  <h4 className="font-semibold text-lg text-gray-100">Michael Rodriguez</h4>
                  <p className="text-gray-400">Middle School Math Teacher</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The adaptive learning suggestions have been a game-changer for my students who were struggling with certain concepts."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition feature-card">
              <div className="flex items-center mb-4">
                <img src="/api/placeholder/60/60" alt="Teacher" className="rounded-full border-2 border-gray-600" />
                <div className="ml-4">
                  <h4 className="font-semibold text-lg text-gray-100">Jennifer Lee</h4>
                  <p className="text-gray-400">Elementary School Teacher</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The dashboard helps me quickly identify which students need extra attention. I can now spend more time teaching and less time on paperwork."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">Ready to Transform Your Teaching?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 text-gray-400">
            Join thousands of educators who are saving time and improving student outcomes with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleSignupClick}
              className="bg-cyan-600 text-white py-3 px-8 rounded-full hover:bg-cyan-700 transition font-semibold"
            >
              Start Free Trial
            </button>
            <button className="border-2 border-cyan-600 text-cyan-400 py-3 px-8 rounded-full hover:bg-gray-700 transition font-semibold">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">EduGenius</h3>
              <p className="text-gray-400">
                Transforming education with AI-powered assistance for teachers and personalized learning for students.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-200">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">AI Grading</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Feedback Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Plagiarism Checker</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Analytics Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-200">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Webinars</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-200">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">info@edugenius.com</li>
                <li className="text-gray-400">1-800-EDU-GENIUS</li>
                <li className="text-gray-400">123 Learning Lane, Education City</li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition">
                  <Video className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition">
                  <Book className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 EduGenius. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
