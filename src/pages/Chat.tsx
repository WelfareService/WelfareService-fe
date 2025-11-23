import { useEffect, useRef, useState, type FormEvent } from 'react';
import ChatBubble from '../components/ChatBubble';
import Map from '../components/Map';
import { fetchBenefitLocations, sendChatMessage } from '../api/client';
import type { Message, RecommendationItem } from '../types/chat';
import type { Marker, MarkerResponse } from '../types/marker';
import '../style/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [locations, setLocations] = useState<Record<string, { lat: number; lng: number }>>({});
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [latestRecommendations, setLatestRecommendations] = useState<RecommendationItem[]>([]);
  const [showMap, setShowMap] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedId = Number(localStorage.getItem('userId'));
    if (storedId) {
      setUserId(storedId);
    } else {
      setError('로그인 후 이용해주세요.');
    }

    setLoadingHistory(false); // 히스토리 API 없음

    const loadLocations = async () => {
      try {
        const res: MarkerResponse = await fetchBenefitLocations();
        const map: Record<string, { lat: number; lng: number }> = {};
        res.markers.forEach((m) => {
          if (m.id && m.lat && m.lng) {
            map[m.id] = { lat: m.lat, lng: m.lng };
          }
        });
        setLocations(map);
        setMarkers(res.markers);
      } catch {
        // 위치 데이터가 없어도 채팅은 진행 가능
      }
    };

    loadLocations();
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
    if (!userId) {
      setError('로그인 후 이용해주세요.');
      return;
    }

    const userMessage: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setSending(true);

    try {
      const botMessage = await sendChatMessage(userId, text);
      const top3: RecommendationItem[] = (botMessage?.recommendations ?? [])
        .slice(0, 3)
        .map((item) => ({
          ...item,
          location:
            item.location ??
            (item.benefitId && locations[item.benefitId]
              ? { lat: locations[item.benefitId].lat, lng: locations[item.benefitId].lng }
              : undefined),
        }));

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botMessage?.assistantMessage ?? '응답을 불러오지 못했습니다.',
          recommendations: top3,
        },
      ]);
      setLatestRecommendations(top3);
    } catch {
      setError('메시지 전송에 실패했습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setSending(false);
    }
  };

  const mapRecommendations: RecommendationItem[] =
    latestRecommendations.length > 0
      ? latestRecommendations
      : markers.slice(0, 3).map((m) => ({
        benefitId: m.id,
        title: m.title,
        category: '위치',
        score: 0,
        summary: '지도에 표시됩니다.',
        location: { lat: m.lat, lng: m.lng },
      }));

  return (
    <div className="chat-page">
      <div className="chat-card">
        <header className="chat-header">
          <div className="header-left">
            <div className="assistant-avatar">💜</div>
            <div className="header-text">
              <h1>복지 도우미</h1>
              <p>필요한 복지 정보를 함께 찾아드릴게요</p>
            </div>
          </div>
          <button
            className="view-map"
            type="button"
            onClick={() => setShowMap(true)}
            disabled={mapRecommendations.length === 0}
          >
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

      <Map
        visible={showMap}
        onClose={() => setShowMap(false)}
        recommendations={mapRecommendations}
      />
    </div>
  );
};

export default Chat;
