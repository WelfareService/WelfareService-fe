import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/client';
import type { User } from '../types/user';
import '../style/SignUp.css';

// 상태 태그 (enum 금지 환경 대응: const 객체)
export const STATUS_TAG = {
  LOW_INCOME: '저소득',
  HOUSING_VULNERABLE: '주거취약',
  UNEMPLOYED: '미취업',
  YOUTH_IN_CRISIS: '위기청년',
  INCOME_DECREASE: '소득감소',
  FOOD_INSECURE: '결식위험',
  SINGLE_PARENT: '한부모',
  DISABLED: '장애',
  BORDERLINE_INTELLIGENCE: '경계선지능',
  EARLY_EMPLOYED: '취업초기',
  GIVEN_UP_JOB_SEARCH: '구직단념',
  MENTAL_HEALTH_RISK: '심리위험',
  SOCIAL_ISOLATION_RISK: '고립위험',
  WITHDRAWN: '은둔',
  ENTREPRENEURSHIP_INTEREST: '창업희망',
  LACK_OF_EXPERIENCE: '경험부족',
  JOB_SEEKING: '구직중',
  SOCIAL_PARTICIPATION_WISH: '사회참여희망',
  HEALTH_RISK: '건강위기',
  YOUTH_PREPARING_INDEPENDENCE: '자립준비청년',
  SUICIDE_RISK: '자살위험',
  WORKING: '근로',
  SOCIAL_CONNECTION_IMPROVEMENT: '고립완화',
  YOUTH_OUT_OF_HOME: '가정밖청년',
  CARE_BURDEN: '돌봄부담',
  CULTURAL_ACTIVITY: '문화활동',
  FINANCIAL_CRISIS: '금융위기',
} as const;

const RESIDENCE_OPTIONS = ['산격1동', '산격2동', '산격3동', '산격4동'] as const;
type ResidenceOption = (typeof RESIDENCE_OPTIONS)[number];

type StatusTagKey = keyof typeof STATUS_TAG;
type StatusTagSelection = Record<StatusTagKey, boolean>;
type StatusTagValue = (typeof STATUS_TAG)[StatusTagKey];

const text = {
  title: '회원가입',
  subtitle: '내 정보를 입력해주세요',
  name: '이름',
  age: '나이',
  residence: '거주지(산격1~4동)',
  tagSection: '기본 태그 선택',
  submit: '회원가입',
  loading: '등록 중...',
  error: '회원가입에 실패했습니다. 입력값을 확인해주세요.',
  successTitle: '가입 완료! 🎉',
  successIdLabel: '사용자 ID는',
  countdownSuffix: '초 후 로그인 페이지로 이동합니다...',
  moving: '로그인 페이지로 이동합니다...',
};

const buildInitialTagState = (): StatusTagSelection =>
  (Object.keys(STATUS_TAG) as StatusTagKey[]).reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as StatusTagSelection);

const SignUp = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [residence, setResidence] = useState<ResidenceOption>('산격1동');
  const [selectedTags, setSelectedTags] = useState<StatusTagSelection>(buildInitialTagState());
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleTagToggle = (tagKey: StatusTagKey) => {
    setSelectedTags((prev) => ({ ...prev, [tagKey]: !prev[tagKey] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const selectedValues: StatusTagValue[] = (Object.keys(selectedTags) as StatusTagKey[])
        .filter((key) => selectedTags[key])
        .map((key) => STATUS_TAG[key]);

      const payload = {
        name: name.trim(),
        age: typeof age === 'number' ? age : 0,
        residence,
        baseTags: selectedValues,
      };

      const user = await registerUser(payload);
      setCreatedUser(user);
      localStorage.setItem('userId', String(user.id));
    } catch {
      setError(text.error);
    } finally {
      setLoading(false);
    }
  };

  // 가입 성공 시 3초 카운트다운 후 로그인 페이지로 이동
  useEffect(() => {
    if (!createdUser) return;

    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [createdUser]);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/login');
    }
  }, [countdown, navigate]);

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="signup-header">
          <div className="icon-circle">😊</div>
          <div>
            <h2>{text.title}</h2>
            <p>{text.subtitle}</p>
          </div>
        </div>

        {createdUser ? (
          <div className="success-box" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>{text.successTitle}</p>
            <p style={{ fontSize: '16px', wordBreak: 'break-all' }}>
              {text.successIdLabel}: <b>{createdUser.id}</b>
            </p>
            <p style={{ marginTop: '15px', color: '#6d5dfc', fontWeight: 'bold' }}>
              {countdown !== null ? `${countdown}${text.countdownSuffix}` : text.moving}
            </p>
          </div>
        ) : (
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>{text.name}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="input-group">
              <label>{text.age}</label>
              <input
                type="number"
                value={age}
                min={0}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                required
              />
            </div>

            <div className="input-group">
              <label>{text.residence}</label>
              <select value={residence} onChange={(e) => setResidence(e.target.value as ResidenceOption)}>
                {RESIDENCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="tag-section">
              <p className="tag-title">{text.tagSection}</p>
              <div className="tag-list">
                {(Object.keys(STATUS_TAG) as StatusTagKey[]).map((key) => {
                  const value = STATUS_TAG[key];
                  const isSelected = selectedTags[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTagToggle(key)}
                      className={`tag-item ${isSelected ? 'selected' : ''}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? text.loading : text.submit}
            </button>
          </form>
        )}

        {error && <div className="error-box" style={{ margin: createdUser ? '20px' : '0 20px 20px' }}>{error}</div>}
      </div>
    </div>
  );
};

export default SignUp;
