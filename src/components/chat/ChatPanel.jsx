import ChatInput from './ChatInput'
import ChatMessageList from './ChatMessageList'
import RecommendationCards from './RecommendationCards'

function ChatPanel({
  messages,
  recommendations,
  riskLevel,
  recommendationIssued,
  userName,
  residence,
  baseTags,
  onSendMessage,
  isLoading,
  onSelectRecommendation,
  errorMessage,
  reserveMobileSpace = false,
}) {
  return (
    <section className={`flex h-full flex-col bg-panel-dark/90 ${reserveMobileSpace ? 'pb-72 lg:pb-0' : ''}`}>
      <header className="border-b border-white/5 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Welfare Engine v2.6</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">맞춤형 복지 추천 챗봇</h1>
        <p className="text-sm text-slate-400">상담 내용을 입력하고 TOP3 정책과 위치 정보를 받아보세요.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
          {userName ? (
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80">👤 {userName}</span>
          ) : null}
          {residence ? (
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80">📍 {residence}</span>
          ) : null}
          {baseTags?.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <ChatMessageList messages={messages} userName={userName} />
          <RecommendationCards
            recommendations={recommendations}
            riskLevel={riskLevel}
            recommendationIssued={recommendationIssued}
            onSelectRecommendation={onSelectRecommendation}
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="px-4 pb-2 text-center text-sm text-rose-400">{errorMessage}</div>
      ) : null}

      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </section>
  )
}

export default ChatPanel
