const riskStyles = {
  LOW: {
    label: 'LOW RISK',
    bg: 'bg-emerald-500/15',
    chip: 'bg-emerald-500 text-emerald-900',
    text: 'text-emerald-300',
  },
  MID: {
    label: 'MID RISK',
    bg: 'bg-amber-500/15',
    chip: 'bg-amber-500 text-amber-900',
    text: 'text-amber-300',
  },
  HIGH: {
    label: 'HIGH RISK',
    bg: 'bg-rose-500/15',
    chip: 'bg-rose-500 text-rose-100',
    text: 'text-rose-300',
  },
}

function RecommendationCards({ recommendations, riskLevel, recommendationIssued, onSelectRecommendation }) {
  if (!recommendations.length) return null

  const normalizedRisk = riskLevel === 'MEDIUM' ? 'MID' : riskLevel
  const pill = riskStyles[normalizedRisk] || riskStyles['LOW']

  return (
    <div className="space-y-3">
      <div className={`flex items-center justify-between rounded-2xl px-4 py-2 text-xs ${pill.bg}`}>
        <div>
          <p className="text-[10px] text-slate-400">Risk Monitor</p>
          <p className={`font-semibold tracking-wide ${pill.text}`}>현재 위험도: {pill.label}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
            recommendationIssued ? 'bg-white text-ink' : pill.chip
          }`}
        >
          {recommendationIssued ? '추천 완료' : '상담 중'}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((recommendation) => (
          <button
            key={recommendation.benefitId}
            type="button"
            className="group flex h-full flex-col rounded-3xl border border-white/5 bg-card-muted/80 p-4 text-left text-white shadow-lg transition hover:border-accent-blue/60 hover:shadow-glow"
            onClick={() => onSelectRecommendation(recommendation)}
          >
            <p className="text-[11px] uppercase tracking-widest text-slate-400">
              {recommendation.category || '복지'}
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-snug">{recommendation.title}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {recommendation.summary}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span># {recommendation.benefitId}</span>
              <span className="text-accent-blue group-hover:text-white">자세히 보기 →</span>
            </div>
          </button>
        ))}
      </div>
      {recommendationIssued ? (
        <p className="text-xs text-slate-400">
          이미 TOP3 추천이 발송된 상태예요. &ldquo;재추천&rdquo;을 입력하면 새 추천을 받을 수 있습니다.
        </p>
      ) : null}
    </div>
  )
}

export default RecommendationCards
