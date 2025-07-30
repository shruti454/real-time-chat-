class AdvancedChatApp {
  constructor() {
    this.currentUser = null;
    this.currentAvatar = '🧑';
    this.messages = [];
    this.messageId = 1;
    this.selectedFile = null;
    this.isDarkMode = false;
                
    this.emojis = [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
      '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
      '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
      '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
      '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
      '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
      '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
      '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
      '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
      '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
      '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
      '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻',
      '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸',
      '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️',
      '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎',
      '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
      '💝', '💟', '👍', '👎', '👌', '🤌', '🤏', '✌️',
      '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕',
      '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
      '🙌', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵'
    ];
                
    this.init();
  }

  init() {
    this.populateEmojiPicker();
    this.bindEvents();
    this.loadWelcomeMessages();
  }

  bindEvents() {
    // Sign in form
    document.getElementById('signinForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.signIn();
    });

    // Avatar selection
    document.getElementById('avatarSelection').addEventListener('click', (e) => {
      if (e.target.classList.contains('avatar-option')) {
        document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
        this.currentAvatar = e.target.dataset.avatar;
      }
    });

  
    // Message input
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    messageInput.addEventListener('input', () => {
      this.autoResize();
      this.handleTyping();
    });

    // Send button
    document.getElementById('sendButton').addEventListener('click', () => {
      this.sendMessage();
    });

    // File input
    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.handleFileSelect(e);
    });

    // Click outside emoji picker to close
    document.addEventListener('click', (e) => {
      const emojiPicker = document.getElementById('emojiPicker');
      const emojiButton = e.target.closest('.input-action-btn');
                    
      if (!emojiPicker.contains(e.target) && !emojiButton) {
        emojiPicker.style.display = 'none';
      }
    });
  }

  populateEmojiPicker() {
    const emojiGrid = document.getElementById('emojiGrid');
    this.emojis.forEach(emoji => {
      const emojiItem = document.createElement('div');
      emojiItem.className = 'emoji-item';
      emojiItem.textContent = emoji;
      emojiItem.addEventListener('click', () => {
        this.insertEmoji(emoji);
      });
      emojiGrid.appendChild(emojiItem);
    }); 
  }

  signIn() {
    const username = document.getElementById('usernameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
                
    if (!username || !email) return;

    this.currentUser = {
      username: username,
      email: email,
      avatar: this.currentAvatar,
      joinedAt: new Date()
    };

    // Update UI
    document.getElementById('currentUsername').textContent = username;
    document.getElementById('currentUserAvatar').textContent = this.currentAvatar;

    // Switch to chat
    document.getElementById('signinContainer').classList.add('hidden');
    document.getElementById('chatContainer').classList.add('show');

    // Add welcome message
    this.addSystemMessage(`Welcome ${username}! 🎉 You've joined the chat.`);
                
    // Simulate other users welcoming
    setTimeout(() => {
      this.simulateWelcomeMessages();
    }, 1000);
  }

  signOut() {
    this.currentUser = null;
    this.messages = [];
    document.getElementById('messagesContainer').innerHTML = '';
    document.getElementById('signinContainer').classList.remove('hidden');
    document.getElementById('chatContainer').classList.remove('show');
                
    // Reset form
    document.getElementById('signinForm').reset();
    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.avatar-option').classList.add('selected');
    this.currentAvatar = '🧑';
  }

  loadWelcomeMessages() {
    const welcomeMessages = [
      { user: 'System', text: '🎉 Welcome to Advanced Chat! Sign in to start messaging.', isSystem: true },
      { user: 'Alice', avatar: '👩', text: 'Hey everyone! Looking forward to chatting! 😊', timestamp: new Date(Date.now() - 120000) },
      { user: 'Bob', avatar: '👨', text: 'This new chat app looks amazing! 🚀', timestamp: new Date(Date.now() - 60000) }
    ];

    welcomeMessages.forEach(msg => {
      if (msg.isSystem) {
        this.addSystemMessage(msg.text);
      } 
      else {
        this.addMessage(msg);
      }
    });
  }

  simulateWelcomeMessages() {
    const welcomes = [
      { user: 'Alice', avatar: '👩', text: `Welcome ${this.currentUser.username}! 👋` },
      { user: 'Bob', avatar: '👨', text: 'Great to have you here! 🎉' },
      { user: 'Charlie', avatar: '🦸', text: 'Hey there! Ready to chat? 😄' }
    ];

    welcomes.forEach((msg, index) => {
      setTimeout(() => {
        this.addMessage({
          ...msg,
          timestamp: new Date(),
          id: this.messageId++
        });
        this.scrollToBottom();
      }, (index + 1) * 1500);
    });
  }

  sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();
                
    if (!text && !this.selectedFile) return;
    if (!this.currentUser) return;

    const message = {
      id: this.messageId++,
      user: this.currentUser.username,
      avatar: this.currentUser.avatar,
      text: text,
      timestamp: new Date(),
      isOwn: true,
      file: this.selectedFile
    };

    this.addMessage(message);
    messageInput.value = '';
    this.selectedFile = null;
    document.getElementById('filePreview').style.display = 'none';
    this.autoResize();
    this.scrollToBottom();

    // Simulate responses
    setTimeout(() => this.simulateResponse(), 1000 + Math.random() * 2000);
  }

  addMessage(message) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.isOwn ? 'own' : ''}`;
                
    const timeString = message.timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    let fileContent = '';
    if (message.file) {
      if (message.file.type.startsWith('image/')) {
        fileContent = `<div style="margin-top: 8px;"><img src="${message.file.url}" alt="${message.file.name}" style="max-width: 200px; border-radius: 10px;"></div>`;
      } 
      else {
        fileContent = `<div style="margin-top: 8px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 12px;">📎 ${message.file.name}</div>`;
      }
    }

    messageDiv.innerHTML = `
      <div class="message-avatar">${message.avatar || '👤'}</div>
      <div class="message-content">
      <div class="message-bubble">
      ${message.text}
      ${fileContent}
      </div>
      <div class="message-info">
      ${message.user} • ${timeString}
      </div>
      <div class="message-reactions" onclick="addReaction(this)">
      <div class="reaction">👍 2</div>
      <div class="reaction">❤️ 1</div>
      </div>
      </div>
      `;

      messagesContainer.appendChild(messageDiv);
  }

  addSystemMessage(text) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.style.textAlign = 'center';
    messageDiv.style.margin = '20px 0';
    messageDiv.style.color = '#718096';
    messageDiv.style.fontSize = '14px';
    messageDiv.style.fontStyle = 'italic';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
  }

  simulateResponse() {
    const users = [
      { name: 'Alice', avatar: '👩' },
      { name: 'Bob', avatar: '👨' },
      { name: 'Charlie', avatar: '🦸' },
      { name: 'Diana', avatar: '🎨' }
    ];

    const responses = [
      "That's really interesting! 🤔",
      "I totally agree! 👍",
      "Thanks for sharing! 😊",
      "Wow, that's amazing! 🤩",
      "Great point! 💯",
      "I love this conversation! ❤️",
      "So true! 🎯",
      "Absolutely! 🙌",
      "This is fun! 🎉",
      "Keep it coming! 🚀"
    ];

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Show typing indicator
    this.showTypingIndicator(randomUser.name);

    setTimeout(() => {
      this.hideTypingIndicator();
                    
      this.addMessage({
        id: this.messageId++,
        user: randomUser.name,
        avatar: randomUser.avatar,
        text: randomResponse,
        timestamp: new Date(),
        isOwn: false
      });
                    
      this.scrollToBottom();
    }, 1000 + Math.random() * 2000);
  }

  showTypingIndicator(user) {
    document.getElementById('typingUser').textContent = user;
    document.getElementById('typingIndicator').style.display = 'block';
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
  }

  handleTyping() {
    // Simulate typing indicator for current user
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      // Stop typing             
    }, 1000);
  }

  toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
  }

  insertEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
                
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.focus();
    messageInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
                
    document.getElementById('emojiPicker').style.display = 'none';
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Create file object with URL for preview
    this.selectedFile = {
      name: file.name,
      size: this.formatFileSize(file.size),
      type: file.type,
      url: URL.createObjectURL(file)
    };

    // Show file preview
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
    document.getElementById('filePreview').style.display = 'flex';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile() {
    this.selectedFile = null;
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('fileInput').value = '';
  }

  autoResize() {
    const textarea = document.getElementById('messageInput');
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  scrollToBottom() {
    setTimeout(() => {
        const container = document.getElementById('messagesContainer');
        container.scrollTop = container.scrollHeight;
    }, 100);
  }

  clearChat() {
    if (confirm('Are you sure you want to clear the chat?')) {
        document.getElementById('messagesContainer').innerHTML = '';
        this.messages = [];
        this.addSystemMessage('Chat cleared! 🧹');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.style.filter = this.isDarkMode ? 'invert(1) hue-rotate(180deg)' : 'none';
  }
}

// Global functions
function addReaction(element) {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
  const reactionDiv = document.createElement('div');
  reactionDiv.className = 'reaction';
  reactionDiv.textContent = `${randomReaction} 1`;
  element.appendChild(reactionDiv);
}

function removeFile() {
  if (window.chatApp) {
    window.chatApp.removeFile();
  }
}

function toggleDarkMode() {
  if (window.chatApp) {
    window.chatApp.toggleDarkMode();
  }
}

function clearChat() {
if (window.chatApp) {
  window.chatApp.clearChat();
  }
}
function signOut() {
  if (window.chatApp) {
    window.chatApp.signOut();
  }
}  


// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  window.chatApp = new AdvancedChatApp();
});

(function(){
  function c(){
    var b=a.contentDocument||a.contentWindow.document;
    if(b){
      var d=b.createElement('script');
      d.innerHTML="window.__CF$cv$params={r:'966f1cbe1510a785',t:'MTc1MzgxODI4MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName('head')[0].appendChild(d)
    }
  }
  if(document.body){
      var a=document.createElement('iframe');
      a.height=1;
      a.width=1;
      a.style.position='absolute';
      a.style.top=0;
      a.style.left=0;
      a.style.border='none';
      a.style.visibility='hidden';
      document.body.appendChild(a);
      if('loading'!==document.readyState)c();
      else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);
      else{
        var e=document.onreadystatechange||function(){};
        document.onreadystatechange=function(b){
          e(b);
          'loading'!==document.readyState&&(document.onreadystatechange=e,c())
        }
      }
  }
})();
