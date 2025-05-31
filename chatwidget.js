/**
 * Chat Widget for n8n Integration
 * 
 * This script controls the behavior of the chat widget, providing a
 * minimizable interface that expands from a chat bubble to a full chat box.
 */

// DOM Elements
const chatWidgetContainer = document.getElementById('chat-widget-container');
const chatBubble = document.getElementById('chat-bubble');
const chatBox = document.getElementById('chat-box');
const minimizeBtn = document.getElementById('minimize-btn');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const notificationBadge = document.querySelector('.notification-badge');

// Chat state

let ipsession; // variable to store the IP
let countrysession;
let citysession;

(async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    console.log('IP Address:', data.ip);

    // Store in your variable
    ipsession = data.ip;
    countrysession = data.country_name
    citysession = data.city
    console.log('My variable shani:', shani);
  } catch (error) {
    console.error('Error fetching IP info:', error);
  }
})();

const chatState = {
  isOpen: false,
  unreadCount: 0,
  agentName: 'Support Agent',
  agentStatus: 'online',
  messages: [],
  sessionId: ipsession+'_'+countrysession+'_'+citysession
};

// n8n webhook URL
const N8N_WEBHOOK_URL = 'https://primary-production-4ef44.up.railway.app/webhook/091a6209-157d-4bfd-8f64-733a65624da8/chat';

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeChat);
chatBubble.addEventListener('click', toggleChat);
minimizeBtn.addEventListener('click', minimizeChat);
chatForm.addEventListener('submit', handleMessageSubmit);
chatInput.addEventListener('keydown', handleTyping);

function initializeChat() {
  updateNotificationBadge();
  
  if (chatState.messages.length === 0) {
    chatState.messages = [
      {
        sender: 'agent',
        content: 'Hello! How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }
  
  scrollToBottom();
}

function toggleChat() {
  if (chatState.isOpen) {
    minimizeChat();
  } else {
    expandChat();
  }
}

function expandChat() {
  chatBox.classList.add('active');
  chatState.isOpen = true;
  chatState.unreadCount = 0;
  updateNotificationBadge();
  notifyChatOpened();
  
  setTimeout(() => {
    chatInput.focus();
  }, 300);
  
  scrollToBottom();
}

function minimizeChat() {
  chatBox.classList.remove('active');
  chatState.isOpen = false;
  notifyChatMinimized();
}

function handleMessageSubmit(event) {
  event.preventDefault();
  
  const messageText = chatInput.value.trim();
  if (!messageText) return;
  
  addMessageToChat('user', messageText);
  chatInput.value = '';
  sendMessageToN8n(messageText);
  showTypingIndicator();
}

function addMessageToChat(sender, content) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `${sender}-message`);
  
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  
  const messagePara = document.createElement('p');
  messagePara.textContent = content;
  messageContent.appendChild(messagePara);
  
  const timeSpan = document.createElement('span');
  timeSpan.classList.add('message-time');
  timeSpan.textContent = timestamp;
  messageContent.appendChild(timeSpan);
  
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);
  
  chatState.messages.push({
    sender,
    content,
    timestamp
  });
  
  scrollToBottom();
  
  if (!chatState.isOpen && sender === 'agent') {
    chatState.unreadCount++;
    updateNotificationBadge();
  }
  
  saveMessageHistory();
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('typing-indicator');
  typingDiv.id = 'typing-indicator';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.classList.add('typing-dot');
    typingDiv.appendChild(dot);
  }
  
  chatMessages.appendChild(typingDiv);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function handleTyping(event) {
  // Optional: Add "user is typing" indicator
}

function updateNotificationBadge() {
  if (chatState.unreadCount > 0) {
    notificationBadge.textContent = chatState.unreadCount > 9 ? '9+' : chatState.unreadCount;
    notificationBadge.classList.add('active');
  } else {
    notificationBadge.classList.remove('active');
  }
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateAgentStatus(status) {
  const statusIndicator = document.querySelector('.status-indicator');
  const statusText = document.querySelector('.status-text');
  
  chatState.agentStatus = status;
  
  if (status === 'online') {
    statusIndicator.classList.add('online');
    statusText.textContent = 'Online';
  } else {
    statusIndicator.classList.remove('online');
    statusText.textContent = 'Offline';
  }
}

async function sendMessageToN8n(message) {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin',
      body: JSON.stringify({
        sessionId: chatState.sessionId,
        action: 'sendMessage',
        chatInput: message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    removeTypingIndicator();
    
    if (data.output) {
      addMessageToChat('agent', data.output);
    }
  } catch (error) {
    console.error('Error sending message to n8n:', error);
    removeTypingIndicator();
    addMessageToChat('agent', 'Sorry, I encountered an error. Please try again later.');
  }
}

function saveMessageHistory() {
  localStorage.setItem('chatHistory', JSON.stringify(chatState.messages));
}

async function notifyChatOpened() {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin',
      body: JSON.stringify({
        sessionId: chatState.sessionId,
        action: 'chatOpened'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.warn('Error notifying chat opened:', error);
  }
}

async function notifyChatMinimized() {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin',
      body: JSON.stringify({
        sessionId: chatState.sessionId,
        action: 'chatMinimized'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.warn('Error notifying chat minimized:', error);
  }
}

function receiveMessageFromN8n(message) {
  addMessageToChat('agent', message);
}

window.chatWidget = {
  receiveMessage: receiveMessageFromN8n,
  updateStatus: updateAgentStatus,
  openChat: expandChat,
  closeChat: minimizeChat
};
