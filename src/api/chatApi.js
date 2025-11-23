const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function sendChat(userId, message, history, options = {}) {
  const payload = {
    userId,
    message,
    history,
  }

  if (options.override) {
    payload.override = true
  }

  const response = await fetch(`${API_BASE_URL}/api/recommendations/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('상담 요청에 실패했습니다.')
  }

  return response.json()
}
