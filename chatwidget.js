(function() {
  // Create the chat widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'chat-widget-container';
  widgetContainer.innerHTML = `
    <div id="chat-bubble">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
           viewBox="0 0 24 24" fill="none" stroke="currentColor" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
           class="chat-icon">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="notification-badge">0</span>
    </div>
    <div id="chat-box">
      <div id="chat-header">
        <div class="header-info">
          <div class="agent-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                 class="agent-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
            </svg>
          </div>
          <div class="header-text">
            <h3 class="agent-name">Support Agent</h3>
            <div class="agent-status">
              <span class="status-indicator online"></span>
              <span class="status-text">Online</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button id="minimize-btn" aria-label="Minimize chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-area">
        <form id="chat-form">
          <input type="text" id="chat-input" placeholder="Type your message..." aria-label="Type your message" autocomplete="off">
          <button type="submit" id="send-btn" aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                 class="send-icon">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(widgetContainer);

  // Insert CSS
  const style = document.createElement('style');
  style.innerHTML = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; }
    #chat-widget-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 1000; display: flex; flex-direction: column; align-items: flex-end; }
    #chat-bubble { width: 60px; height: 60px; background-color: #3B82F6; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); position: relative; transition: transform 0.3s ease, box-shadow 0.3s ease; }
    #chat-bubble:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); }
    .chat-icon { color: white; }
    .notification-badge { position: absolute; top: 0; right: 0; background-color: #EF4444; color: white; font-size: 12px; font-weight: 600; width: 20px; height: 20px; border-radius: 50%; display: flex; justify-content: center; align-items: center; transform: translate(25%, -25%); opacity: 0; transition: opacity 0.3s ease; }
    .notification-badge.active { opacity: 1; }
    #chat-box { position: absolute; bottom: 80px; right: 0; width: 350px; height: 450px; background-color: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column; overflow: hidden; transform-origin: bottom right; transform: scale(0); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; }
    #chat-box.active { transform: scale(1); opacity: 1; }
    #chat-header { background-color: #3B82F6; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
    .header-info { display: flex; align-items: center; gap: 12px; }
    .agent-avatar { width: 36px; height: 36px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; justify-content: center; align-items: center; }
    .agent-icon { color: white; width: 20px; height: 20px; }
    .header-text { display: flex; flex-direction: column; }
    .agent-name { font-size: 16px; font-weight: 600; margin-bottom: 2px; }
    .agent-status { display: flex; align-items: center; gap: 6px; font-size: 12px; }
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; background-color: #10B981; }
    .header-actions button { background: none; border: none; color: white; cursor: pointer; opacity: 0.8; display: flex; align-items: center; justify-content: center; }
    .header-actions button:hover { opacity: 1; }
    #chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    #chat-input-area { padding: 12px 16px; border-top: 1px solid #E5E7EB; }
    #chat-form { display: flex; gap: 10px; }
    #chat-input { flex: 1; padding: 10px 14px; border: 1px solid #D1D5DB; border-radius: 24px; font-size: 14px; outline: none; }
    #chat-input:focus { border-color: #3B82F6; }
    #send-btn { background-color: #3B82F6; border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .send-icon { color: white; }
  `;
  document.head.appendChild(style);

  // Chat bubble toggle
  const chatBubble = document.getElementById('chat-bubble');
  const chatBox = document.getElementById('chat-box');
  const minimizeBtn = document.getElementById('minimize-btn');

  chatBubble.addEventListener('click', () => {
    chatBox.classList.toggle('active');
  });
  minimizeBtn.addEventListener('click', () => {
    chatBox.classList.remove('active');
  });

  // Message sending (for demonstration, just append the text)
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text === '') return;

    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    userMessage.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
    chatMessages.appendChild(userMessage);
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Example response (echo)
    setTimeout(() => {
      const agentMessage = document.createElement('div');
      agentMessage.classList.add('message', 'agent-message');
      agentMessage.innerHTML = `<div class="message-content"><p>Echo: ${text}</p></div>`;
      chatMessages.appendChild(agentMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  });
})();
