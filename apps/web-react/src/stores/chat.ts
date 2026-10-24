import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  messageList: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  appendMessageContent: (msgId: string, text: string) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    messageList: [],
    addMessage: (msg) =>
      set((state) => {
        state.messageList.push(msg);
      }),
    appendMessageContent: (msgId, text) =>
      set((state) => {
        const target = state.messageList.find((m) => m.id === msgId);
        if (target) {
          target.content += text;
        }
      }),
  })),
);
