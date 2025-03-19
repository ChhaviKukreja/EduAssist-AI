
import React, { useState, useEffect } from 'react';

const cheatsheetsTab = () => {

  const [activeSection, setActiveSection] = useState('cheatsheets');// Sample formulas and cheat sheets
const cheatSheets = [
    { title: "Calculus Formulas", content: "Integration by parts: ∫u dv = uv - ∫v du\nChain rule: d/dx[f(g(x))] = f'(g(x))·g'(x)" },
    { title: "Physics Constants", content: "Gravitational constant (G): 6.674×10^−11 m^3⋅kg^−1⋅s^−2\nSpeed of light (c): 299,792,458 m/s" },
    { title: "SQL Commands", content: "SELECT column FROM table WHERE condition;\nCREATE TABLE table_name (column1 datatype, column2 datatype);" }
  ];

return (
    <div>
        {/* Cheat Sheets Section */}
        {activeSection === 'cheatsheets' && (
          <section className="cheatsheets-section">
            <h1>Last-Minute Cheat Sheets</h1>
            <p>Quick references for key formulas and concepts</p>

            <div className="search-filter">
              <input type="text" placeholder="Search formulas..." />
              <select>
                <option value="all">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="cs">Computer Science</option>
              </select>
            </div>

            <div className="cheatsheets-container">
              {cheatSheets.map((sheet, index) => (
                <div className="cheatsheet-card" key={index}>
                  <h3>{sheet.title}</h3>
                  <pre className="formula-content">{sheet.content}</pre>
                  <div className="cheatsheet-actions">
                    <button>Print</button>
                    <button>Add to Favorites</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="create-cheatsheet">
              <h2>Create Custom Cheat Sheet</h2>
              <form className="cheatsheet-form">
                <input type="text" placeholder="Title" />
                <textarea placeholder="Enter formulas and notes here..."></textarea>
                <button type="submit">Save Cheat Sheet</button>
              </form>
            </div>
          </section>
        )}
    </div>
)
}

export default cheatsheetsTab;