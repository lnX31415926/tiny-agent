import { defineStore } from 'pinia'
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}
export const useChatStore = defineStore('chat', {
  state: () => ({
    messageList: [] as ChatMessage[],
  }),
  actions: {
    addMessage(msg: ChatMessage) {
      this.messageList.push(msg)
    },
    appendMessageContent(msgId: string, text: string) {
      const target = this.messageList.find((m) => m.id === msgId)
      if (target) {
        target.content += text
      }
    },
  },
})
