<template>
  <div class="dashboard">
    <!-- Other dashboard content here -->
    
    <!-- Chatbot icon -->
    <button @click="toggleChatbotPopup" class="chat-icon">
      <i class="fas fa-comment"></i>
    </button>

    <!-- Chatbot popup -->
    <div v-if="isChatbotOpen" class="chat-popup">
      <div class="chat-header">
        <span class="chat-title">Chatbot</span>
        <button class="close-button" @click="toggleChatbotPopup">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="chat-messages">
        <div v-for="(message, index) in chatMessages" :key="index" class="message">
          <div class="message-content" :class="message.sender">{{ message.text }}</div>
        </div>
      </div>
      <div class="message-input">
        <input v-model="newMessage" @keydown.enter="sendMessage" style="width: calc(100% - 40px);" placeholder="Type your message" />
        <button @click="sendMessage" class="send-button">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';

export default {
  data() {
    return {
      isChatbotOpen: false,
      chatMessages: [],
      newMessage: '',
      socket: null,
    };
  },
  created() {
    // Connect to the Socket.io server
    this.socket = io('http://192.168.11.213:3000');

    // Set up listeners for incoming messages
    this.socket.on('chatMessage1', message => {
      this.handleIncomingMessage(message);
    });

    // Fetch the session ID after the socket connection is established
    this.fetchSessionId();
  },
  methods: {
    toggleChatbotPopup() {
      console.log('Toggling chatbot popup');
      this.isChatbotOpen = !this.isChatbotOpen;
    },
    handleIncomingMessage(message) {
      console.log('Received incoming message:', message);
      this.chatMessages.push({ text: message, sender: 'bot' });
    },
    sendMessage() {
      const userMessage = this.newMessage.trim();
      if (userMessage !== '') {
        console.log('Sending user message:', userMessage);
        this.chatMessages.push({ text: userMessage, sender: 'user' });

        // Emit the user message to the socket server
        this.socket.emit('chatMessage1', userMessage);

        this.newMessage = '';
      }
    },
    async fetchSessionId() {
  try {
    const response = await axios.get('http://192.168.11.213:3000');
    const sessionId = response.data.sessionId;
    console.log('Session ID obtained:', sessionId);

    if (!sessionId) {
      console.error('Session ID not found in API response');
      return;
    }

    this.makeApiCall(sessionId);
  } catch (error) {
    console.error('Error fetching session ID:', error);
  }
},
    async makeApiCall(sessionId) {
      try {
        // Make your API call using Axios
        console.log('Making API call with session ID:', sessionId);
        const response = await axios.post('http://192.168.11.213:3000', {
          sessionId: sessionId, // Include the session ID in the request
          // Other payload data if needed
        });

        // Handle the API response
        console.log('API response:', response.data);
      } catch (error) {
        console.error('API call error:', error);
      }
    },
  },
};
</script>


<style scoped>
.dashboard {
  position: relative;
  /* Add any other styling for your dashboard */
}
.messages-container {
  padding: 10px;
  overflow-y: auto;
  max-height: calc(100% - 50px); /* Account for chat header and message input */
}


.chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.chat-popup {
  position: fixed;
  bottom: 20px;
  right: 80px;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Add other styling for chat header, messages, and message input */

.message {
  margin: 10px;
  display: flex;
  justify-content: flex-end;
  margin-left: 40px;
}

.message-content {
  padding: 8px;
  border-radius: 5px;
}

.user {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
  
}

.bot {
  background-color: #f0f0f0;
  color: black;
  align-self: flex-start;
  margin-right: 50px;
}
.message-input {
  display: flex;
  align-items: center;
  padding: 15px; /* Increase padding for better spacing */
  background-color: #f7f7f7;
  border-top: 1px solid #ccc;
  height: 80px; /* Increase the height for a larger input field */
}
.message-input input {
  width: calc(100% - 40px); /* Leave some space for the send button */
  height: 40px; /* Increase the height for a larger input field */
  font-size: 16px; /* Adjust the font size as needed */
}
.send-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #007bff;
  width: 40px; /* Increase the width for a larger button */
  height: 40px; /* Increase the height for a larger button */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background-color 0.3s, color 0.3s;
}
.send-button:hover {
  background-color: #f0f0f0;
  color: #0056b3;
}
</style>
