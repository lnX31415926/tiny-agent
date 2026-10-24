import { useState } from "react";
import "./ChatInput.css";

interface Props {
  onSend: (text: string) => void;
}
export default function ChatInput({ onSend }: Props) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    onSend(text);
    setInputText("");
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-wrap">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息，回车发送"
      />
      <button onClick={handleSend}>发送</button>
    </div>
  );
}
