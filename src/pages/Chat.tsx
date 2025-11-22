import { useEffect, useRef, useState, type FormEvent } from 'react';
import ChatBubble from '../components/ChatBubble';
import { fetchChatHistory, sendChatMessage } from '../api/client';
import type { Message } from '../types/chat';
import '../style/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory();
        if (active) setMessages(data);
      } catch {
        if (active) setError('대화 내역을 불러오지 못했습니다. 다시 시도해주세요.');
      } finally {
        if (active) setLoadingHistory(false);
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    await sendFlow(text);
  };

  const sendFlow = async (text: string) => {
    const userMessage: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setSending(true);

    try {
      const botMessage = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        botMessage ?? { sender: 'bot', text: '응답을 불러오지 못했습니다.' },
      ]);
    } catch {
      setError('메시지 전송에 실패했습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-card">
        <header className="chat-header">
          <div className="header-left">
            <div className="assistant-avatar">💜</div>
            <div className="header-text">
              <h1>복지피티</h1>
              <p>필요한 복지 정보를 함께 찾아요</p>
            </div>
          </div>
          <button className="view-map" type="button">
            지도 보기
          </button>
        </header>

        <section className="chat-window">
          {loadingHistory ? (
            <div className="placeholder">이전 대화를 불러오는 중...</div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatBubble key={`${message.sender}-${index}-${message.text}`} message={message} />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </section>

        <footer className="chat-footer-shell">
          {error && <div className="chat-error-banner">{error}</div>}
          <div className="chat-input-area">
            <form className="chat-form" onSubmit={handleSend}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                disabled={sending}
              />
              <button type="submit" disabled={sending || !input.trim()}>
                {sending ? '전송 중...' : '보내기'}
              </button>
            </form>
          </div>
          <p className="helper-text">Enter 키로 전송할 수 있어요.</p>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
