<template>
  <div class="chat-page">
    <h2>AI对话</h2>
    <div class="msg-container">
      <ChatMessage v-for="item in chatStore.messageList" :key="item.id" :msg="item" />
    </div>
    <ChatInput @send="onSendMessage" />
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import ChatMessage from '../components/ChatMessage.vue'
import ChatInput from '../components/ChatInput.vue'
import { v4 as uuidv4 } from 'uuid'
import { requestCompletionStream } from '@/api/agentRequest.ts'
const chatStore = useChatStore()

/**
 * 前端打字机：逐个字符延迟追加
 * @param msgId 消息ID
 * @param fullStr 完整文本
 * @param speed 间隔ms
 */
async function typeWriter(msgId: string, fullStr: string, speed = 30) {
  // 逐个字符循环追加
  for (let i = 0; i < fullStr.length; i++) {
    const char = fullStr[i] as string
    chatStore.appendMessageContent(msgId, char)
    await new Promise((resolve) => setTimeout(resolve, speed))
  }
}

const onSendMessage = async (text: string) => {
  // 添加用户消息
  chatStore.addMessage({
    id: uuidv4(),
    role: 'user',
    content: text,
  })
  // 创建空AI消息
  const aiMsgId = uuidv4()
  chatStore.addMessage({
    id: aiMsgId,
    role: 'assistant',
    content: '',
  })

  let isTyping = false
  // 字符队列：存放待打印的单个字符
  const charQueue: string[] = []

  // 消费队列：每次取队列里的字符，传给 typeWriter
  const consumeQueue = async () => {
    if (isTyping) return
    isTyping = true
    while (charQueue.length > 0) {
      // 每次取出一个字符，传给typeWriter
      const singleChar = charQueue.shift()!
      await typeWriter(aiMsgId, singleChar, 30)
    }
    isTyping = false
  }

  await requestCompletionStream({ prompt: text }, (chunk: string) => {
    // 重点：chunk拆成单个字符，全部推入队列
    const chars = chunk.split('')
    charQueue.push(...chars)
    // 启动消费
    consumeQueue()
  })
}
</script>
<style scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.msg-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
</style>
