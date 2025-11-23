import { useEffect, useRef, useState } from 'react'
import { FALLBACK_POSITION } from '../../constants/location'
import MarkerList from './MarkerList'

const loadKakaoSdk = () => {
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve()
  }

  if (!window.__kakaoMapLoader) {
    window.__kakaoMapLoader = new Promise((resolve) => {
      const script = document.createElement('script')
      const appKey = import.meta.env.VITE_KAKAO_MAP_KEY
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey || ''}`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve()
        })
      }
      document.head.appendChild(script)
    })
  }

  return window.__kakaoMapLoader
}

function MapContainer({ recommendations, onMarkerSelect, selectedBenefitId }) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    let mounted = true
    loadKakaoSdk().then(() => {
      if (!mounted || !mapRef.current) return
      const { kakao } = window
      const first = recommendations[0]?.location || FALLBACK_POSITION
      const center = new kakao.maps.LatLng(first.lat, first.lng)
      const mapInstance = new kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      })
      setMap(mapInstance)

      setTimeout(() => {
        mapInstance.relayout()
      }, 200)
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!map || !recommendations.length) return
    const { kakao } = window
    const first = recommendations[0].location || FALLBACK_POSITION
    const center = new kakao.maps.LatLng(first.lat, first.lng)
    map.setCenter(center)
  }, [map, recommendations])

  return (
    <div className="absolute inset-0">
      <div ref={mapRef} className="h-full w-full" />
      {map ? (
        <MarkerList
          map={map}
          recommendations={recommendations}
          selectedBenefitId={selectedBenefitId}
          onMarkerSelect={onMarkerSelect}
        />
      ) : null}
    </div>
  )
}

export default MapContainer
