import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/userApi'

const ALL_TAGS = ['저소득', '미취업', '주거불안', '한부모', '심리위험', '건강위험']

function TagToggle({ label, isChecked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isChecked ? 'bg-accent-blue text-white' : 'bg-panel-muted text-slate-300 hover:bg-panel-muted/70'
      }`}
    >
      {label}
    </button>
  )
}

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [residence, setResidence] = useState('산격동')
  const [baseTags, setBaseTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const toggleTag = (tag) => {
    setBaseTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const payload = {
        name,
        age,
        residence,
        baseTags,
      }
      const response = await registerUser(payload)
      if (!response?.id) {
        throw new Error('사용자 등록에 실패했습니다.')
      }
      localStorage.setItem('userId', response.id)

      const profilePayload = {
        userName: response.name || name,
        residence: response.residence || residence,
        baseTags: response.baseTags || baseTags,
      }
      localStorage.setItem('userProfile', JSON.stringify(profilePayload))

      navigate('/chat')
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message || '사용자 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/5 bg-panel-dark/80 p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Step 01</p>
        <h1 className="mt-2 text-3xl font-semibold">사용자 등록</h1>
        <p className="text-slate-400">기본 정보를 입력하면 맞춤형 복지 추천이 더 정확해집니다.</p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300">이름</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-panel-muted px-4 py-3 text-white outline-none focus:border-accent-blue"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">나이</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-panel-muted px-4 py-3 text-white outline-none focus:border-accent-blue"
              value={age}
              onChange={(event) => setAge(event.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">거주지(동)</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-panel-muted px-4 py-3 text-white outline-none focus:border-accent-blue"
              value={residence}
              onChange={(event) => setResidence(event.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">상황(baseTags) 선택</label>
            <div className="mt-3 flex flex-wrap gap-3">
              {ALL_TAGS.map((tag) => (
                <TagToggle key={tag} label={tag} isChecked={baseTags.includes(tag)} onToggle={() => toggleTag(tag)} />
              ))}
            </div>
          </div>

          {errorMessage ? <p className="text-sm text-rose-400">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-accent-blue px-4 py-3 text-center text-lg font-semibold text-white shadow-glow disabled:opacity-50"
          >
            {isSubmitting ? '등록 중...' : '등록하고 상담 시작하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
