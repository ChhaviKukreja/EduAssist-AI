import React, { useState, useEffect } from 'react';

const chatsTab = () => {

  const [activeSection, setActiveSection] = useState('chat');
const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
// Handle chat message sending
const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { text: newMessage, sender: 'user', time: new Date().toLocaleTimeString() }]);

      // Simulate response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          text: "I received your message. How can I help you with this topic?",
          sender: 'assistant',
          time: new Date().toLocaleTimeString()
        }]);
      }, 1000);

      setNewMessage('');
    }
  };

return (
    <div>
        {/* Chat Section */}
        {activeSection === 'chat' && (
          <section className="chat-section">
            <h1>Chat with Classmates</h1>

            <div className="chat-container">
              <div className="chat-sidebar">
                <div className="chat-search">
                  <input type="text" placeholder="Search conversations..." />
                </div>
                <div className="chat-list">
                  <div className="chat-item active">
                    <div className="chat-avatar">JD</div>
                    <div className="chat-preview">
                      <h3>John Doe</h3>
                      <p>Did you understand the homework?</p>
                    </div>
                  </div>
                  <div className="chat-item">
                    <div className="chat-avatar">SS</div>
                    <div className="chat-preview">
                      <h3>Study Group</h3>
                      <p>Meeting tomorrow at 3pm</p>
                    </div>
                  </div>
                  <div className="chat-item">
                    <div className="chat-avatar">AS</div>
                    <div className="chat-preview">
                      <h3>Alice Smith</h3>
                      <p>Thanks for the notes!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chat-main">
                <div className="chat-header">
                  <h2>John Doe</h2>
                  <p>Online</p>
                </div>

                <div className="chat-messages">
                  {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => (
                      <div className={`chat-message ${msg.sender}`} key={index}>
                        <div className="message-content">{msg.text}</div>
                        <div className="message-time">{msg.time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            </div>
          </section>
        )}

    </div>
)
}

export default chatsTab;