import React, { useState, useEffect } from 'react';

const focusTab = () => {

  const [activeSection, setActiveSection] = useState('focus');
const [tasks, setTasks] = useState([]);
const [newTask, setNewTask] = useState('');
const [studyTimer, setStudyTimer] = useState(25 * 60); // 25 minutes in seconds
const [timerRunning, setTimerRunning] = useState(false);

// Start/stop timer
const toggleTimer = () => {
    setTimerRunning(!timerRunning);
};

// Reset timer
const resetTimer = () => {
    setTimerRunning(false);
    setStudyTimer(25 * 60);
};

// Relaxation exercises
const relaxationExercises = [
    { title: "Box Breathing", description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 5 times." },
    { title: "Progressive Muscle Relaxation", description: "Tense and then relax each muscle group in your body, starting from your toes and working up to your head." },
    { title: "Mindfulness Meditation", description: "Focus on your breath, acknowledging thoughts as they come but letting them pass without judgment." }
];


// Format time for timer display
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

return (
    <div>
        {/* Focus & Relaxation Section */}
        {activeSection === 'focus' && (
          <section className="focus-section">
            <h1>Focus Mode & Relaxation</h1>

            <div className="focus-timer">
              <h2>Pomodoro Timer</h2>
              <div className="timer-display">
                {formatTime(studyTimer)}
              </div>
              <div className="timer-controls">
                <button onClick={toggleTimer}>
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer}>Reset</button>
              </div>
              <div className="timer-settings">
                <button onClick={() => setStudyTimer(25 * 60)}>25 min</button>
                <button onClick={() => setStudyTimer(45 * 60)}>45 min</button>
                <button onClick={() => setStudyTimer(60 * 60)}>60 min</button>
              </div>
            </div>

            <div className="task-list">
              <h2>Study Tasks</h2>
              <div className="tasks">
                {tasks.map((task, index) => (
                  <div className="task-item" key={index}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        const newTasks = [...tasks];
                        newTasks[index].completed = !newTasks[index].completed;
                        setTasks(newTasks);
                      }}
                    />
                    <span className={task.completed ? 'completed' : ''}>{task.text}</span>
                  </div>
                ))}
              </div>
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Add new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button onClick={handleAddTask}>Add</button>
              </div>
            </div>

            <div className="relaxation-exercises">
              <h2>Relaxation Exercises</h2>
              <div className="exercises-list">
                {relaxationExercises.map((exercise, index) => (
                  <div className="exercise-card" key={index}>
                    <h3>{exercise.title}</h3>
                    <p>{exercise.description}</p>
                    <button>Start Exercise</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

    </div>
)
}

export default focusTab;