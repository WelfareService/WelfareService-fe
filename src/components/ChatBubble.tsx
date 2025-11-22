import type { FC } from 'react';
import type { Message } from '../types/chat';
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
      </div>
    </div>
  );
};

export default ChatBubble;
