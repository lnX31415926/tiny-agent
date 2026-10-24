import type { ChatMessage } from "../../../stores/chat";
import "./ChatMessage.css";

interface Props {
  msg: ChatMessage;
}
export default function ChatMessage({ msg }: Props) {
  return (
    <div className={`msg-item ${msg.role}`}>
      <span>{msg.content}</span>
    </div>
  );
}
