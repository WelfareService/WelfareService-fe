import type { FC } from 'react';
import type { Message, RecommendationItem } from '../types/chat';
import '../style/Chat.css';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`chat-row ${isUser ? 'align-right' : 'align-left'}`}>
      <div className={`chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        <p>{message.text}</p>
        {!isUser && message.recommendations && message.recommendations.length > 0 && (
          <div className="recommendations">
            {message.recommendations.map((item: RecommendationItem) => (
              <div className="recommendation-card" key={item.benefitId}>
                <p className="rec-title">{item.title}</p>
                <p className="rec-category">{item.category}</p>
                <p className="rec-summary">{item.summary}</p>
                {item.location && item.location.lat && item.location.lng && (
                  <p className="rec-location">
                    위치: {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
