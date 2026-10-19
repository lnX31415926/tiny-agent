<template>
  <div class="chat-page">
    <h2>AI对话</h2>
    <div class="msg-container">
      <ChatMessage v-for="item in chatStore.messageList" :key="item.id" :msg="item"/>
    </div>
    <ChatInput @send="onSendMessage" />
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import ChatMessage from '../components/ChatMessage.vue'
import ChatInput from '../components/ChatInput.vue'
import { sendChatRequest } from '../api/chatApi'
import { v4 as uuidv4 } from 'uuid'

const chatStore = useChatStore()

const onSendMessage = async (text: string) => {
  // 添加用户消息
  chatStore.addMessage({
    id: uuidv4(),
    role: 'user',
    content: text
  })
  // 请求后端
  const reply = await sendChatRequest(text)
  // 添加AI回复
  chatStore.addMessage({
    id: uuidv4(),
    role: 'assistant',
    content: reply
  })
}
</script>
<style scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  display:flex;
  flex-direction: column;
}
.msg-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
</style>
