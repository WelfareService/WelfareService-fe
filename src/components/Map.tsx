import { useEffect, useRef } from 'react';
import type { RecommendationItem } from '../types/chat';
import '../style/Chat.css';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  visible: boolean;
  onClose: () => void;
  recommendations: RecommendationItem[];
  appKey?: string;
}

const DEFAULT_APP_KEY = 'e7a46d1dbe1884c8a5c68382c0ef92a7';

const Map = ({ visible, onClose, recommendations, appKey = DEFAULT_APP_KEY }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const loadKakao = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') return;
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(resolve);
        } else {
          reject(new Error('kakao maps load failed'));
        }
      };
      script.onerror = () => reject(new Error('kakao script error'));
      document.head.appendChild(script);
    });

  useEffect(() => {
    const render = async () => {
      if (!visible || recommendations.length === 0) return;
      try {
        await loadKakao();
        const container = mapContainerRef.current;
        if (!container) return;

        const positions = recommendations
          .filter((rec) => rec.location && rec.location.lat && rec.location.lng)
          .map((rec) => ({
            title: rec.title,
            latlng: new window.kakao.maps.LatLng(rec.location!.lat, rec.location!.lng),
          }));

        if (positions.length === 0) return;

        const map = new window.kakao.maps.Map(container, {
          center: positions[0].latlng,
          level: 5,
        });

        positions.forEach((pos) => {
          const marker = new window.kakao.maps.Marker({
            map,
            position: pos.latlng,
            title: pos.title,
          });
          const info = new window.kakao.maps.InfoWindow({
            content: `<div class="map-infowindow">${pos.title}</div>`,
          });
          window.kakao.maps.event.addListener(marker, 'click', () => {
            info.open(map, marker);
          });
        });

        const bounds = new window.kakao.maps.LatLngBounds();
        positions.forEach((pos) => bounds.extend(pos.latlng));
        map.setBounds(bounds);
      } catch {
        // 지도 로드 실패 시 무시
      }
    };

    render();
  }, [visible, recommendations]);

  if (!visible) return null;

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal" onClick={(e) => e.stopPropagation()}>
        <header className="map-modal-header">
          <h3>추천 복지 위치</h3>
          <button type="button" onClick={onClose}>
            닫기
          </button>
        </header>
        <div ref={mapContainerRef} id="kakao-map" className="kakao-map-container" />
        <div className="map-list">
          {recommendations.map((rec) => (
            <div key={rec.benefitId} className="map-list-item">
              <p className="rec-title">{rec.title}</p>
              {rec.location && (
                <p className="rec-location">
                  ({rec.location.lat.toFixed(4)}, {rec.location.lng.toFixed(4)})
                </p>
              )}
            </div>
          ))}
          {recommendations.length === 0 && <p className="placeholder">표시할 위치가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
};

export default Map;
