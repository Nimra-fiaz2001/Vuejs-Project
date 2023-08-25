<template>
    <div class="dashboard">
      <!-- ... existing dashboard content ... -->
      <div class="message-icon" @click="toggleChatbot">
        <!-- Icon or element to toggle chatbot -->
      </div>
      <div class="chatbot-container" :class="{ 'chatbot-open': chatIsOpen }">
        <div class="chatbot-messages" ref="chatMessages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="message.sender"
          >
            {{ message.text }}
          </div>
        </div>
        <div class="chatbot-input">
          <input
            type="text"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
          />
          <button @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { io } from "socket.io-client";
  
  export default {
    data() {
      return {
        showChat: false,
        messages: [],
        newMessage: "",
        socket: null,
      };
    },
    created() {
      this.connectSocket();
    },
    methods: {
      toggleChatbot() {
        this.showChat = !this.showChat; // Corrected method name
      },
      connectSocket() {
        this.socket = io("http://192.168.11.213:3000");
  
        this.socket.on("chat message", (message) => {
          this.addMessageToChat(message.text, "bot"); // Use "bot" as sender
        });
        
        this.socket.on("receive-message", (data) => {
          const receivedMessage = {
            id: Date.now(),
            text: data.message,
            sender: "bot", // Assuming you want to show received messages from the bot
            receiver: data.receiver,
          };
          this.addMessageToChat(receivedMessage.text, receivedMessage.sender,receivedMessage.receiver);
        });
      },
      addMessageToChat(text, sender,receiver) {
        this.messages.push({ text, sender , receiver });
        this.scrollToBottom();
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const chatMessages = this.$refs.chatMessages;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      },
      sendMessage() {
        const messageText = this.newMessage.trim();
        if (messageText) {
          this.addMessageToChat(messageText, "user"); // Use "user" as sender
          this.socket.emit("chat message", messageText);
          this.newMessage = "";
        }
      },
    },
  };
  </script>
<style>
/* Example CSS for styling the chatbot */
.chatbot-container {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
}

.chatbot-messages {
  margin-bottom: 10px;
}

.chatbot-messages .message {
  margin: 5px 0;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.chatbot-input {
  display: flex;
  margin-top: 10px;
}

.chatbot-input input {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 5px;
}

.chatbot-input button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.chatbot-messages .user {
  background-color: #c0ffee; /* Replace with your preferred color */
  margin-right: auto;
}
.chatbot-messages .bot {
  background-color: #ffeecc; /* Replace with your preferred color */
  margin-left: auto;
  text-align: right;
}
.message {
  margin: 5px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: inline-block;
  max-width: 70%; /* Adjust based on your design */
}
</style>
