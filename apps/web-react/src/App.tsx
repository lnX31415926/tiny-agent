import { useState } from "react";
import "./App.css";
import ChatPage from "./pages/chat/ChatPage";

function App() {
  const [count, setCount] = useState(0);

  return <ChatPage></ChatPage>;
}

export default App;
