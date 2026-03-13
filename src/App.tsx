import { useCallback } from "react";
import { useChat } from "./hooks/useChat";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import TopBar from "./components/TopBar";
import ChatArea from "./components/ChatArea";
import InputBar from "./components/InputBar";
import "./App.css";

function App() {
  const { messages, isLoading, sendMessage } = useChat();
  const isOnline = useOnlineStatus();

  const handleSuggestion = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  return (
    <div className="app">
      <TopBar isOnline={isOnline} />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onSuggestion={handleSuggestion}
      />
      <InputBar onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;
