import { FALLBACK_POSITION } from '../../constants/location'
import MapContainer from './MapContainer'

function MapPanel({ recommendations, onMarkerSelect, selectedBenefitId, isMobile }) {
  const normalizedRecommendations = recommendations.map((recommendation) => ({
    ...recommendation,
    location: {
      lat: recommendation.location?.lat ?? FALLBACK_POSITION.lat,
      lng: recommendation.location?.lng ?? FALLBACK_POSITION.lng,
    },
  }))

  if (!normalizedRecommendations.length) return null

  return (
    <aside
      className={`flex h-full flex-col bg-ink text-white ${
        isMobile
          ? 'rounded-t-3xl border border-white/10 p-4 shadow-2xl backdrop-blur'
          : 'border-l border-white/5 px-5 py-6'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500">Live Map</p>
          <h2 className="text-lg font-semibold text-white">주변 복지 기관 위치</h2>
          <p className="text-xs text-slate-400">마커를 누르면 상세 정책을 확인할 수 있어요.</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase text-slate-300">
          {normalizedRecommendations.length} spots
        </span>
      </div>

      <div
        className={`relative mt-4 flex-1 overflow-hidden rounded-3xl border border-white/5 ${
          isMobile ? 'h-80' : 'h-full'
        }`}
      >
        <MapContainer
          recommendations={normalizedRecommendations}
          onMarkerSelect={onMarkerSelect}
          selectedBenefitId={selectedBenefitId}
        />
      </div>

      <p className="mt-3 text-[11px] text-slate-400">
        지도는 추천이 생성된 이후에만 활성화됩니다. 다른 추천을 보고 싶다면 "재추천"이라고 입력하세요.
      </p>
    </aside>
  )
}

export default MapPanel
