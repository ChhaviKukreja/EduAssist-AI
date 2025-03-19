import React, { useState, useEffect } from 'react';

const recommendationsTab = () => {

  const [activeSection, setActiveSection] = useState('recommendations');
// Sample recommended content
const recommendedContent = [
    { title: "Advanced Calculus Concepts", type: "Video", duration: "15 min" },
    { title: "Data Structures Fundamentals", type: "Article", duration: "8 min" },
    { title: "Programming Paradigms", type: "Quiz", duration: "10 min" },
    { title: "Machine Learning Basics", type: "Interactive", duration: "20 min" }
  ];

return(
    <div>
        {/* Recommendations Section */}
        {activeSection === 'recommendations' && (
          <section className="recommendations-section">
            <h1>Smart Content Recommendations</h1>
            <p>Based on your learning patterns and upcoming exams, we recommend:</p>

            <div className="recommended-content">
              {recommendedContent.map((item, index) => (
                <div className="content-card" key={index}>
                  <div className="content-type">{item.type}</div>
                  <h3>{item.title}</h3>
                  <p>{item.duration}</p>
                  <button>View Content</button>
                </div>
              ))}
            </div>

            <div className="learning-insights">
              <h2>Learning Insights</h2>
              <div className="insight-card">
                <h3>You're making great progress!</h3>
                <p>Your understanding of calculus concepts has improved by 15% in the last week.</p>
              </div>
              <div className="insight-card">
                <h3>Knowledge Gap Detected</h3>
                <p>You might want to review "Linear Algebra Transformations" before your next exam.</p>
              </div>
            </div>
          </section>
        )}
    </div>
)
}

export default recommendationsTab;