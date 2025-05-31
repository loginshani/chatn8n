(function() {
  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
   * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  color: #333;
}

/* Chat Widget Container */
#chat-widget-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* Chat Bubble (Minimized State) */
#chat-bubble {
  width: 60px;
  height: 60px;
  background-color: #3B82F6;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#chat-bubble:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.chat-icon {
  color: white;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #EF4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(25%, -25%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.notification-badge.active {
  opacity: 1;
}

/* Chat Box (Expanded State) */
#chat-box {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 450px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

#chat-box.active {
  transform: scale(1);
  opacity: 1;
}

/* Email Collection Form */
#email-collection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 2;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

#email-collection.active {
  transform: translateY(0);
}

#email-collection h3 {
  color: #1F2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

#email-collection p {
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

#email-form {
  width: 100%;
  max-width: 300px;
}

#email-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

#email-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

#email-form button:hover {
  background-color: #2563EB;
}

#skip-email {
  background: none;
  border: none;
  color: #6B7280;
  font-size: 0.875rem;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: underline;
}

#skip-email:hover {
  color: #4B5563;
}

/* Chat Header */
#chat-header {
  background-color: #3B82F6;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-avatar {
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.agent-icon {
  color: white;
  width: 20px;
  height: 20px;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.agent-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.agent-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9CA3AF;
}

.status-indicator.online {
  background-color: #10B981;
}

.header-actions button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-actions button:hover {
  opacity: 1;
}

/* Chat Messages Container */
#chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#chat-messages::-webkit-scrollbar {
  width: 6px;
}

#chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

#chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.message {
  max-width: 80%;
  display: flex;
}

.agent-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
}

.message-content {
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
}

.agent-message .message-content {
  background-color: #F3F4F6;
  border-bottom-left-radius: 4px;
}

.user-message .message-content {
  background-color: #3B82F6;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-content p {
  margin-bottom: 4px;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  display: block;
  text-align: right;
}

/* Chat Input Area */
#chat-input-area {
  padding: 12px 16px;
  border-top: 1px solid #E5E7EB;
}

#chat-form {
  display: flex;
  gap: 10px;
}

#chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #D1D5DB;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

#chat-input:focus {
  border-color: #3B82F6;
}

#send-btn {
  background-color: #3B82F6;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

#send-btn:hover {
  background-color: #2563EB;
}

.send-icon {
  width: 18px;
  height: 18px;
}

/* Responsive Styles */
@media (max-width: 480px) {
  #chat-box {
    width: 300px;
    height: 400px;
    bottom: 70px;
  }

  #chat-bubble {
    width: 50px;
    height: 50px;
  }

  .message {
    max-width: 90%;
  }
}

/* Animation for new messages */
@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  animation: messageIn 0.3s ease forwards;
}

/* Typing indicator animation */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: #F3F4F6;
  border-radius: 18px;
  width: fit-content;
  margin-top: 8px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background-color: #9CA3AF;
  border-radius: 50%;
  animation: typingAnimation 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingAnimation {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
  `;
  document.head.appendChild(style);

  // Create chat widget container
  const widget = document.createElement("div");
  widget.id = "chat-widget-container";
  widget.innerHTML = `
     <div id="chat-bubble">
      <!-- n8n INTEGRATION: Replace this with your custom icon if needed -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chat-icon">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="notification-badge">0</span>
    </div>

    <!-- Chat Box (Expanded State) -->
    <div id="chat-box">
      <!-- Email Collection Form -->
      <div id="email-collection">
        <h3>Welcome to Chat Support!</h3>
        <p>Enter your email to receive updates about your conversation (optional)</p>
        <form id="email-form">
          <input 
            type="email" 
            id="email-input" 
            placeholder="Your email address"
            aria-label="Your email address"
          >
          <button type="submit">Continue</button>
        </form>
        <button id="skip-email">Skip for now</button>
      </div>

      <!-- Chat Header -->
      <div id="chat-header">
        <div class="header-info">
          <div class="agent-avatar">
            <!-- n8n INTEGRATION: Replace with your agent avatar -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="agent-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
            </svg>
          </div>
          <div class="header-text">
            <!-- n8n INTEGRATION: Replace with dynamic agent name -->
            <h3 class="agent-name">Support Agent</h3>
            <div class="agent-status">
              <span class="status-indicator online"></span>
              <span class="status-text">Online</span>
              <!-- n8n INTEGRATION: Status can be dynamically updated -->
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button id="minimize-btn" aria-label="Minimize chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages Container -->
      <div id="chat-messages">
        <!-- n8n INTEGRATION: This area will be populated with messages from n8n -->
        <div class="message agent-message">
          <div class="message-content">
            <p>Hello! How can I help you today?</p>
            <span class="message-time">10:00 AM</span>
          </div>
        </div>
      </div>

      <!-- Chat Input Area -->
      <div id="chat-input-area">
        <form id="chat-form">
          <input 
            type="text" 
            id="chat-input" 
            placeholder="Type your message..." 
            aria-label="Type your message"
            autocomplete="off"
          >
          <button type="submit" id="send-btn" aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="send-icon">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(widget);
var jQueryScript = document.createElement('script');  
jQueryScript.setAttribute('src','https://cdn.jsdelivr.net/gh/loginshani/chatn8n@main/chatwidget.js');
document.head.appendChild(jQueryScript);
})();
