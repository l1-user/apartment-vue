<template>
  <div class="ai-assistant">
    <button class="ai-toggle-btn" @click="toggleChat">
      AI助手
    </button>
    <div v-if="drawerVisible" class="chat-drawer">
      <div class="drawer-header">
        <span>AI智能助手</span>
        <button @click="drawerVisible = false">×</button>
      </div>
      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.isUser ? 'user' : 'ai']">
          <div class="avatar">{{ msg.isUser ? '我' : 'AI' }}</div>
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="inputMessage" @keyup.enter="sendMessage" placeholder="输入您的问题..." />
        <button @click="sendMessage" :disabled="!inputMessage.trim()">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { aiApi } from '@/api/ai'

interface MessageItem {
  content: string
  isUser: boolean
}

const drawerVisible = ref(false)
const inputMessage = ref('')
const messages = ref<MessageItem[]>([])

const toggleChat = () => {
  drawerVisible.value = !drawerVisible.value
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  messages.value.push({ content: inputMessage.value, isUser: true })
  const tempMsg = inputMessage.value
  inputMessage.value = ''
  
  try {
    const res = await aiApi.chat({ message: tempMsg })
    messages.value.push({ content: res.response, isUser: false })
  } catch {
    messages.value.push({ content: '抱歉，AI服务暂时不可用', isUser: false })
  }
}
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.ai-toggle-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.chat-drawer {
  position: fixed;
  right: 0;
  top: 0;
  width: 360px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.drawer-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  display: flex;
  margin-bottom: 16px;
  max-width: 85%;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.message.user .avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.ai .avatar {
  background: #e8e8e8;
  color: #333;
}

.content {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  margin: 0 8px;
}

.message.user .content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 18px 4px 18px 18px;
}

.message.ai .content {
  background: #f5f5f5;
  color: #333;
  border-radius: 4px 18px 18px 18px;
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.chat-input button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>