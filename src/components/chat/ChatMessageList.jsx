function ChatMessageList({ messages, userName }) {
  const getLabel = (role) => {
    if (role === 'user') {
      return userName || '사용자'
    }
    return 'GPT'
  }

  if (!messages.length) {
    return (
      <div className="text-sm text-slate-400 text-center py-10">
        복지 상담을 시작해 보세요. 궁금한 지역이나 상황을 입력하면 TOP3 정책을 찾아드릴게요.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isUser = message.role === 'user'
        return (
          <div
            key={`${message.role}-${index}-${message.content.slice(0, 10)}`}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                isUser ? 'bg-accent-blue text-white shadow-glow' : 'bg-card-muted text-slate-100'
              }`}
            >
              <p className="text-[10px] uppercase tracking-widest text-slate-300 mb-1">
                {getLabel(message.role)}
              </p>
              <p className="whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatMessageList
