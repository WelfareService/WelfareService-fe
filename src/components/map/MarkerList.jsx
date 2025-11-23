import { useEffect, useRef } from 'react'
import { FALLBACK_POSITION } from '../../constants/location'

const defaultMarkerUrl = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
const selectedMarkerUrl = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'

function MarkerList({ map, recommendations, selectedBenefitId, onMarkerSelect }) {
  const markersRef = useRef([])

  useEffect(() => {
    if (!map) return
    const { kakao } = window

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    markersRef.current = recommendations.map((recommendation) => {
      const markerImage = selectedBenefitId === recommendation.benefitId ? selectedMarkerUrl : defaultMarkerUrl
      const lat = recommendation.location?.lat ?? FALLBACK_POSITION.lat
      const lng = recommendation.location?.lng ?? FALLBACK_POSITION.lng
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map,
        title: recommendation.title,
        image: new kakao.maps.MarkerImage(markerImage, new kakao.maps.Size(24, 35)),
      })

      kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerSelect(recommendation)
      })

      return marker
    })

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []
    }
  }, [map, recommendations, selectedBenefitId, onMarkerSelect])

  return null
}

export default MarkerList
