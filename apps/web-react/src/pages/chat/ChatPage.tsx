import { useChatStore } from "../../stores/chat";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import { v4 as uuidv4 } from "uuid";
import { requestCompletionStream } from "../../api/agentRequest";
import "./ChatPage.css";
import { useShallow } from "zustand/react/shallow";
/**
 * 前端打字机：逐个字符延迟追加（和原版逻辑一致）
 */
async function typeWriter(
  appendFn: (id: string, text: string) => void,
  msgId: string,
  fullStr: string,
  speed = 30,
) {
  for (let i = 0; i < fullStr.length; i++) {
    const char = fullStr[i];
    appendFn(msgId, char);
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
}

export default function ChatPage() {
  const { messageList, addMessage, appendMessageContent } = useChatStore(
    useShallow((s) => ({
      messageList: s.messageList,
      addMessage: s.addMessage,
      appendMessageContent: s.appendMessageContent,
    })),
  );
  const onSendMessage = async (text: string) => {
    // 添加用户消息
    addMessage({
      id: uuidv4(),
      role: "user",
      content: text,
    });
    // 创建空AI消息
    const aiMsgId = uuidv4();
    addMessage({
      id: aiMsgId,
      role: "assistant",
      content: "",
    });

    let isTyping = false;
    const charQueue: string[] = [];

    const consumeQueue = async () => {
      if (isTyping) return;
      isTyping = true;
      while (charQueue.length > 0) {
        const singleChar = charQueue.shift()!;
        await typeWriter(appendMessageContent, aiMsgId, singleChar, 50);
      }
      isTyping = false;
    };

    await requestCompletionStream({ prompt: text }, (chunk: string) => {
      const chars = chunk.split("");
      charQueue.push(...chars);
      consumeQueue();
    });
  };

  return (
    <div className="chat-page">
      <h2>AI对话</h2>
      <div className="msg-container">
        {messageList.map((item) => (
          <ChatMessage key={item.id} msg={item} />
        ))}
      </div>
      <ChatInput onSend={onSendMessage} />
    </div>
  );
}
