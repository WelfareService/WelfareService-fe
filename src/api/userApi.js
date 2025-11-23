const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function registerUser(data) {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('사용자 등록에 실패했습니다.')
  }

  return response.json()
}
