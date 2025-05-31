// Single JavaScript File to Initialize the Chat Widget
$(document).ready(function () {
  // Inject CSS into head
  var widgetCSS = `
  /* CSS styles here */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; line-height: 1.5; color: #333; }
  #chat-widget-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 1000; display: flex; flex-direction: column; align-items: flex-end; }
  #chat-bubble { width: 60px; height: 60px; background-color: #3B82F6; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); position: relative; transition: transform 0.3s ease, box-shadow 0.3s ease; }
  #chat-bubble:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); }
  .chat-icon { color: white; }
  .notification-badge { position: absolute; top: 0; right: 0; background-color: #EF4444; color: white; font-size: 12px; font-weight: 600; width: 20px; height: 20px; border-radius: 50%; display: flex; justify-content: center; align-items: center; transform: translate(25%, -25%); opacity: 0; transition: opacity 0.3s ease; }
  .notification-badge.active { opacity: 1; }
  #chat-box { position: absolute; bottom: 80px; right: 0; width: 350px; height: 450px; background-color: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column; overflow: hidden; transform-origin: bottom right; transform: scale(0); opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; }
  #chat-box.active { transform: scale(1); opacity: 1; }
  #chat-header { background-color: #3B82F6; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 12px; border-top-right-radius: 12px; }
  .header-info { display: flex; align-items: center; gap: 12px; }
  .agent-avatar { width: 36px; height: 36px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; justify-content: center; align-items: center; }
  .agent-icon { color: white; width: 20px; height: 20px; }
  .header-text { display: flex; flex-direction: column; }
  .agent-name { font-size: 16px; font-weight: 600; margin-bottom: 2px; }
  .agent-status { display: flex; align-items: center; gap: 6px; font-size: 12px; }
  .status-indicator { width: 8px; height: 8px; border-radius: 50%; background-color: #9CA3AF; }
  .status-indicator.online { background-color: #10B981; }
  .header-actions button { background: none; border: none; color: white; cursor: pointer; opacity: 0.8; transition: opacity 0.2s ease; display: flex; align-items: center; justify-content: center; }
  .header-actions button:hover { opacity: 1; }
  #chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  #chat-messages::-webkit-scrollbar { width: 6px; }
  #chat-messages::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
  #chat-messages::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
  #chat-input-area { padding: 12px 16px; border-top: 1px solid #E5E7EB; }
  #chat-form { display: flex; gap: 10px; }
  #chat-input { flex: 1; padding: 10px 14px; border: 1px solid #D1D5DB; border-radius: 24px; font-size: 14px; outline: none; transition: border-color 0.2s ease; }
  #send-btn { background-color: #3B82F6; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; cursor: pointer; }
  .send-icon { color: white; }
  `;
  $("<style>").text(widgetCSS).appendTo("head");

  // Inject HTML into body
  var widgetHTML = `
  <div id="chat-widget-container">
    <div id="chat-bubble">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span class="notification-badge">0</span>
    </div>
    <div id="chat-box">
      <div id="chat-header">
        <div class="header-info">
          <div class="agent-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="agent-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-area">
        <form id="chat-form">
          <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
          <button type="submit" id="send-btn" aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </div>
  </div>
  `;
  $("body").append(widgetHTML);

  // JS interactions
  $("#chat-bubble").click(function () {
    $("#chat-box").addClass("active");
  });

  $("#minimize-btn").click(function () {
    $("#chat-box").removeClass("active");
  });

  $("#chat-form").submit(function (e) {
    e.preventDefault();
    var message = $("#chat-input").val().trim();
    if (message) {
      var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      $("#chat-messages").append(`
        <div class="message user-message">
          <div class="message-content"><p>${message}</p><span class="message-time">${time}</span></div>
        </div>
      `);
      $("#chat-input").val("");
      $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
    }
  });
});
