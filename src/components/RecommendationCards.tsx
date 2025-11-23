import type { FC } from 'react';
import type { RecommendationItem } from '../types/chat';

interface RecommendationCardsProps {
  recommendations: RecommendationItem[];
  riskLevel?: string | null;
  recommendationIssued?: boolean;
  onSelect?: (recommendation: RecommendationItem) => void;
}

const riskStyles: Record<string, { label: string; chipClass: string; textClass: string }> = {
  LOW: { label: 'LOW RISK', chipClass: 'risk-low', textClass: 'risk-text-low' },
  MID: { label: 'MID RISK', chipClass: 'risk-mid', textClass: 'risk-text-mid' },
  MEDIUM: { label: 'MID RISK', chipClass: 'risk-mid', textClass: 'risk-text-mid' },
  HIGH: { label: 'HIGH RISK', chipClass: 'risk-high', textClass: 'risk-text-high' },
};

const RecommendationCards: FC<RecommendationCardsProps> = ({
  recommendations,
  riskLevel,
  recommendationIssued = false,
  onSelect,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  const normalized = riskLevel ?? 'LOW';
  const pill = riskStyles[normalized] ?? riskStyles.LOW;

  return (
    <section className="recommendations-panel">
      <div className={`risk-pill ${pill.chipClass}`}>
        <span className={pill.textClass}>현재 위험도 {pill.label}</span>
        <span className="risk-status">{recommendationIssued ? '추천 완료' : '상담 진행 중'}</span>
      </div>

      <div className="recommendation-grid">
        {recommendations.slice(0, 3).map((rec) => (
          <button
            key={rec.benefitId}
            type="button"
            className="recommendation-card-v2"
            onClick={() => onSelect?.(rec)}
          >
            <p className="rec-category">{rec.category || '복지'}</p>
            <h3 className="rec-title">{rec.title}</h3>
            <p className="rec-summary">{rec.summary || '상세 설명을 곧 준비할게요'}</p>
            <div className="rec-meta">
              <span># {rec.benefitId}</span>
              <span className="rec-link">{rec.location ? '지도에서 보기' : '자세히 보기'}</span>
            </div>
          </button>
        ))}
      </div>

      {recommendationIssued ? (
        <p className="recommendation-hint">
          이미 TOP3 추천을 발송한 상태예요. "추가 추천"을 입력하면 더 추천을 받을 수 있어요.
        </p>
      ) : null}
    </section>
  );
};

export default RecommendationCards;
