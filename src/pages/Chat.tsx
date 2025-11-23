import { useEffect, useRef, useState, type FormEvent } from 'react';
import ChatBubble from '../components/ChatBubble';
import Map from '../components/Map';
import RecommendationCards from '../components/RecommendationCards';
import { fetchBenefitLocations, sendChatMessage } from '../api/client';
import type { ConversationTurn, Message, RecommendationItem } from '../types/chat';
import type { Marker, MarkerResponse } from '../types/marker';
import '../style/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [locations, setLocations] = useState<Record<string, { lat: number; lng: number }>>({});
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [latestRecommendations, setLatestRecommendations] = useState<RecommendationItem[]>([]);
  const [mapItems, setMapItems] = useState<RecommendationItem[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [recommendationIssued, setRecommendationIssued] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedId = Number(localStorage.getItem('userId'));
    if (storedId) {
      setUserId(storedId);
    } else {
      setError('로그인이 필요해요.');
    }

    setLoadingHistory(false);

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
        // 위치 API 실패 시 채팅만 진행
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildHistory = (userText?: string): ConversationTurn[] => {
    const turns: ConversationTurn[] = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      message: m.text,
    }));
    if (userText) {
      turns.push({ role: 'user', message: userText });
    }
    return turns;
  };

  const getLastUserMessage = (): string | null => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].sender === 'user') return messages[i].text;
    }
    return null;
  };

  const refreshMarkers = async () => {
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
      // 위치 갱신 실패 시 무시
    }
  };

  const attachLocation = (item: RecommendationItem): RecommendationItem => ({
    ...item,
    location:
      item.location ??
      (item.benefitId && locations[item.benefitId]
        ? { lat: locations[item.benefitId].lat, lng: locations[item.benefitId].lng }
        : undefined),
  });

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    await sendFlow(text);
  };

  const sendFlow = async (text: string) => {
    if (!userId) {
      setError('로그인이 필요해요.');
      return;
    }

    const userMessage: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setSending(true);
    setShowTyping(true);

    try {
      const history = buildHistory(text);
      const botMessage = await sendChatMessage(userId, text, history);
      const top3: RecommendationItem[] = (botMessage?.recommendations ?? [])
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 3)
        .map(attachLocation);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botMessage?.assistantMessage ?? '답변을 불러오지 못했어요.',
          recommendations: top3,
        },
      ]);
      setRiskLevel(botMessage?.riskLevel ?? null);
      setRecommendationIssued(Boolean(botMessage?.recommendationIssued));
      setLatestRecommendations(top3);
    } catch {
      setError('메시지 전송에 실패했습니다. 네트워크 상태를 확인해 주세요.');
    } finally {
      setSending(false);
      setShowTyping(false);
    }
  };

  useEffect(() => {
    const filled: RecommendationItem[] = [];

    const recsWithCoords = [...latestRecommendations]
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .map(attachLocation)
      .filter((item) => item.location);

    recsWithCoords.forEach((item) => {
      if (filled.length < 3) filled.push(item);
    });

    if (filled.length < 3) {
      markers.forEach((m) => {
        if (filled.length >= 3) return;
        const exists = filled.find((f) => f.benefitId === m.id);
        if (exists) return;
        filled.push({
          benefitId: m.id,
          title: m.title,
          category: '복지',
          score: 0,
          summary: '',
          location: { lat: m.lat, lng: m.lng },
        });
      });
    }

    setMapItems(filled.slice(0, 3));
  }, [latestRecommendations, markers, locations]);

  const handleMapClick = () => {
    if (!userId) return;
    // 최신 추천을 위치 포함 형태로 재정렬해 바로 지도에 표시
    const mapReady = latestRecommendations
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .map(attachLocation)
      .filter((rec) => rec.location);
    if (mapReady.length > 0) {
      setMapItems(mapReady.slice(0, 3));
    }
    setShowMap(true);
  };

  const handleRecommendationSelect = () => {
    if (latestRecommendations.length === 0) return;
    const mapReady = latestRecommendations.map(attachLocation).filter((rec) => rec.location);
    if (mapReady.length > 0) {
      setMapItems(mapReady);
    }
    setShowMap(true);
  };

  return (
    <div className="chat-page">
      <div className="chat-card">
        <header className="chat-header">
          <div className="header-left">
            <div className="assistant-avatar">福</div>
            <div className="header-text">
              <h1>복지피티</h1>
              <p>필요한 복지 정보를 함께 찾아드릴게요</p>
            </div>
          </div>
          <button
            className="view-map"
            type="button"
            onClick={handleMapClick}
            disabled={mapItems.length === 0}
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
              {showTyping && (
                <div className="chat-row align-left">
                  <div className="chat-bubble bot-bubble typing-bubble">
                    <span className="dot dot1" />
                    <span className="dot dot2" />
                    <span className="dot dot3" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </section>

        {latestRecommendations.length > 0 && (
          <div className="chat-recommendation-shell">
            <div className="recommendation-header">
              <p className="recommendation-label">TOP3 추천</p>
              <span className="recommendation-sub">카드를 누르면 지도에서 위치를 확인할 수 있어요</span>
            </div>
            <RecommendationCards
              recommendations={latestRecommendations}
              riskLevel={riskLevel}
              recommendationIssued={recommendationIssued}
              onSelect={handleRecommendationSelect}
            />
          </div>
        )}

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
                {sending ? '보내는 중...' : '보내기'}
              </button>
            </form>
          </div>
          <p className="helper-text">Enter 키로 전송할 수 있어요</p>
        </footer>
      </div>

      <Map visible={showMap} onClose={() => setShowMap(false)} recommendations={mapItems} />
    </div>
  );
};

export default Chat;
