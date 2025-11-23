import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatPanel from '../components/chat/ChatPanel'
import MapPanel from '../components/map/MapPanel'
import BenefitDetailModal from '../components/map/BenefitDetailModal'
import { sendChat } from '../api/chatApi'
import { fetchBenefitDetail } from '../services/api'

const REFRESH_KEYWORDS = ['다시 추천', '재추천', '새로 추천', '다시 보여줘']

const DEFAULT_PROFILE = {
  userName: '',
  residence: '',
  baseTags: [],
}

const getStoredProfile = () => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const raw = localStorage.getItem('userProfile')
    if (!raw) return DEFAULT_PROFILE
    const parsed = JSON.parse(raw)
    return {
      userName: parsed.userName || '',
      residence: parsed.residence || '',
      baseTags: Array.isArray(parsed.baseTags) ? parsed.baseTags : [],
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

export default function ChatPage() {
  const navigate = useNavigate()
  const [userId] = useState(() => localStorage.getItem('userId'))
  const initialProfile = useMemo(() => getStoredProfile(), [])
  const [userName, setUserName] = useState(initialProfile.userName)
  const [residence, setResidence] = useState(initialProfile.residence)
  const [baseTags, setBaseTags] = useState(initialProfile.baseTags)
  const [messages, setMessages] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [riskLevel, setRiskLevel] = useState('LOW')
  const [recommendationIssued, setRecommendationIssued] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [selectedBenefitId, setSelectedBenefitId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalBaseBenefit, setModalBaseBenefit] = useState(null)
  const [modalDetail, setModalDetail] = useState(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  useEffect(() => {
    if (!userId) {
      navigate('/', { replace: true })
    }
  }, [userId, navigate])

  const shouldForceRefresh = useMemo(() => {
    return (message) => {
      const lower = message.toLowerCase()
      return REFRESH_KEYWORDS.some((keyword) => lower.includes(keyword.toLowerCase()))
    }
  }, [])

  const handleSendMessage = async (message) => {
    if (!userId) {
      setErrorMessage('사용자 등록 후 이용해 주세요.')
      return
    }

    const newEntry = { role: 'user', content: message }
    const updatedMessages = [...messages, newEntry]

    setMessages(updatedMessages)
    setErrorMessage('')
    setIsLoading(true)

    try {
      const historyPayload = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }))
      const response = await sendChat(userId, message, historyPayload, {
        override: shouldForceRefresh(message),
      })

      if (response?.assistantMessage) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.assistantMessage }])
      }

      setRiskLevel(response?.riskLevel || 'LOW')
      setRecommendations(response?.recommendations || [])
      setRecommendationIssued(Boolean(response?.recommendationIssued))

      if (!response?.recommendations?.length) {
        setSelectedBenefitId(null)
      }

      if (response?.userName || response?.residence || response?.baseTags) {
        const nextUserName = response.userName || userName
        const nextResidence = response.residence || residence
        const nextBaseTags = Array.isArray(response.baseTags) ? response.baseTags : baseTags
        setUserName(nextUserName)
        setResidence(nextResidence)
        setBaseTags(nextBaseTags)
        localStorage.setItem(
          'userProfile',
          JSON.stringify({
            userName: nextUserName,
            residence: nextResidence,
            baseTags: nextBaseTags,
          }),
        )
      }

      setIsModalOpen(false)
      setModalBaseBenefit(null)
      setModalDetail(null)
    } catch (error) {
      console.error(error)
      setErrorMessage('추천을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectRecommendation = async (recommendation) => {
    if (!recommendation) return

    setSelectedBenefitId(recommendation.benefitId)
    setModalBaseBenefit(recommendation)
    setModalDetail(null)
    setIsModalOpen(true)
    setDetailError('')
    setIsDetailLoading(true)

    try {
      const detail = await fetchBenefitDetail(recommendation.benefitId)
      setModalDetail(detail)
    } catch (error) {
      console.error(error)
      setDetailError('정책 상세 정보를 불러오지 못했습니다.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalBaseBenefit(null)
    setModalDetail(null)
    setDetailError('')
  }

  const isMapVisible = recommendations.length > 0

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <div className="flex-1 lg:w-3/5">
          <ChatPanel
            messages={messages}
            recommendations={recommendations}
            riskLevel={riskLevel}
            recommendationIssued={recommendationIssued}
            userName={userName}
            residence={residence}
            baseTags={baseTags}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onSelectRecommendation={handleSelectRecommendation}
            errorMessage={errorMessage}
            reserveMobileSpace={isMapVisible}
          />
        </div>

        <div className="hidden lg:block lg:w-2/5">
          {isMapVisible ? (
            <MapPanel
              recommendations={recommendations}
              onMarkerSelect={handleSelectRecommendation}
              selectedBenefitId={selectedBenefitId}
              isMobile={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center border-l border-white/5 bg-panel-dark/60 text-sm text-slate-500">
              추천이 생성되면 실시간 지도가 이 영역에 나타납니다.
            </div>
          )}
        </div>
      </div>

      {isMapVisible ? (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40">
          <MapPanel
            recommendations={recommendations}
            onMarkerSelect={handleSelectRecommendation}
            selectedBenefitId={selectedBenefitId}
            isMobile
          />
        </div>
      ) : null}

      <BenefitDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        baseBenefit={modalBaseBenefit}
        detail={modalDetail}
        isLoading={isDetailLoading}
        error={detailError}
      />
    </div>
  )
}
