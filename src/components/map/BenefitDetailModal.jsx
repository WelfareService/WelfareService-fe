function DetailRow({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  )
}

function BenefitDetailModal({ isOpen, onClose, baseBenefit, detail, isLoading, error }) {
  if (!isOpen) return null

  const merged = detail || baseBenefit

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-6 pt-12 backdrop-blur-sm lg:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-panel-dark shadow-glow">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Benefit Detail</p>
            <h2 className="text-xl font-semibold text-white">{merged?.title || '정책 정보'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-4 py-2 text-xs text-slate-300 transition hover:border-white/60 hover:text-white"
          >
            닫기
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6 text-sm text-slate-200">
          {isLoading ? <p className="text-center text-slate-400">상세 정보를 불러오는 중입니다...</p> : null}
          {error ? <p className="text-center text-rose-400">{error}</p> : null}
          {!isLoading && !error ? (
            <>
              <DetailRow label="주관 기관" value={merged?.institution} />
              <DetailRow label="지원 내용" value={merged?.support || merged?.summary} />
              <DetailRow label="신청 조건" value={merged?.conditions} />
              <DetailRow label="필요 서류" value={merged?.documents} />
              {merged?.url ? (
                <a
                  href={merged.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-accent-blue hover:border-accent-blue/70 hover:text-white"
                >
                  공식 페이지 이동
                  <span aria-hidden>↗</span>
                </a>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default BenefitDetailModal
