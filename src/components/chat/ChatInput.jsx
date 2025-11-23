import { useState } from 'react'

function ChatInput({ onSend, isLoading }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    onSend(trimmed)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel-muted/80 border-t border-white/5 p-4">
      <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-panel-dark p-3">
        <textarea
          rows={2}
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          placeholder="도움이 필요한 상황을 입력해 주세요. (예: 대구에 사는 대학생인데 주거 지원이 필요해요)"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="rounded-full bg-accent-blue px-5 py-2 text-sm font-semibold text-white shadow-glow transition-opacity disabled:opacity-40"
        >
          {isLoading ? '불러오는 중...' : '보내기'}
        </button>
      </div>
    </form>
  )
}

export default ChatInput
