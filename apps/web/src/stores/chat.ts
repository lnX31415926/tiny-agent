import { defineStore } from 'pinia'
import type { ChatItem } from '@/chat/types'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messageList: [] as ChatItem[],
  }),
  actions: {
    addMessage(msg: ChatItem) {
      this.messageList.push(msg)
    },
    clearChat() {
      this.messageList = []
    },
  },
})
