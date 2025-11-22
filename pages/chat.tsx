import { useState } from "react";
import "./design/chat.css";
import Modal from "./design/Modal";
import Map from "./map";

type Message = {
  role: "user" | "bot";
  content: string;
};

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "안녕하세요! 도움이 필요하시면 말씀해 주세요 😊" }
  ]);
  const [input, setInput] = useState("");
  const [openMap, setOpenMap] = useState(false);

  // ✅ 그냥 메시지 추가만
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    const botMsg: Message = { role: "bot", content: "지도 버튼을 눌러보세요 😊" };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="chat-wrapper">

      {/* 헤더 */}
      <div className="chat-header">
        <div className="header-left">
          <div className="icon-circle">💜</div>
          <div>
            <h2>Support Assistant</h2>
            <p>Here to help you<br />discover resources</p>
          </div>
        </div>

        {/* ✅ 버튼 누르면 지도 열림 */}
        <button className="map-btn" onClick={() => setOpenMap(true)}>
          📍 View Map
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-row" : "bot-row"}
          >
            {msg.role === "bot" && <div className="bot-icon">🤖</div>}

            <div className={msg.role === "user" ? "user-bubble" : "bot-bubble"}>
              {msg.content}
              <span className="timestamp">방금</span>
            </div>
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="chat-input">
        <input
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          ➤
        </button>
      </div>

      {/* ✅ 지도 모달 */}
      {openMap && (
        <Modal onClose={() => setOpenMap(false)}>
          <Map />
        </Modal>
      )}
    </div>
  );
}

export default Chat;
