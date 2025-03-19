const [aiResponse, setAiResponse] = useState('');
const [currentQuestion, setCurrentQuestion] = useState('');
const [isLoading, setIsLoading] = useState(false);
// Handle AI doubt solving
const handleAskQuestion = () => {
    if (currentQuestion.trim()) {
      setIsLoading(true);
      // Simulate AI response
      setTimeout(() => {
        setAiResponse("Based on your question, I think you're asking about [topic]. Here's an explanation: [detailed answer would appear here with relevant information and examples].");
        setIsLoading(false);
      }, 2000);
    }
  };

return (
    <div>
         {/* Doubt Solving AI Section */}
         {activeSection === 'doubtai' && (
          <section className="doubtai-section">
            <h1>AI Doubt Solving Assistant</h1>
            <p>Ask any academic question and get instant help</p>

            <div className="question-input">
              <textarea
                placeholder="Type your question here..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
              ></textarea>
              <button onClick={handleAskQuestion} disabled={isLoading}>
                {isLoading ? 'Thinking...' : 'Ask Question'}
              </button>
            </div>

            {isLoading && (
              <div className="loading-indicator">
                <p>Analyzing your question...</p>
              </div>
            )}

            {aiResponse && (
              <div className="ai-response">
                <h2>Answer</h2>
                <div className="response-content">
                  {aiResponse}
                </div>
                <div className="response-actions">
                  <button>Save Response</button>
                  <button>Ask Follow-up</button>
                </div>
              </div>
            )}

            <div className="common-questions">
              <h2>Common Questions</h2>
              <div className="question-chips">
                <div className="chip" onClick={() => setCurrentQuestion("How do I solve quadratic equations?")}>
                  How do I solve quadratic equations?
                </div>
                <div className="chip" onClick={() => setCurrentQuestion("Explain the Krebs cycle")}>
                  Explain the Krebs cycle
                </div>
                <div className="chip" onClick={() => setCurrentQuestion("How does inheritance work in OOP?")}>
                  How does inheritance work in OOP?
                </div>
              </div>
            </div>
          </section>
        )}
    </div>
)