import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../api/client';
import type { User } from '../types/user';
import '../style/Login.css';

const text = {
  welcome: '안녕하세요! 로그인할 ID를 입력해주세요.',
  error: '사용자를 찾지 못했어요. ID를 확인해주세요.',
  successPrefix: '환영합니다,',
  placeholder: '회원 ID 입력',
  login: '로그인',
  loading: '조회 중…',
  signup: '회원가입',
  heroTitle: 'Support Assistant',
  heroSub: 'Here to help you',
};

const Login = () => {
  const [userIdInput, setUserIdInput] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const id = Number(userIdInput);
      if (!id) throw new Error('invalid id');

      const fetched = await fetchUser(id);
      setUser(fetched);
      localStorage.setItem('userId', String(fetched.id));

      // 로그인 성공 시 메인 페이지로 이동
      navigate('/main', { replace: true });
    } catch {
      setError(text.error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <div className="login-header">
          <div className="icon-circle">😊</div>
          <div className="header-text">
            <h2>{text.heroTitle}</h2>
            <p>{text.heroSub}</p>
          </div>
        </div>

        <div className="chat-area">
          <div className="chat-bubble">{text.welcome}</div>

          {error && <div className="chat-error">⚠ {error}</div>}

          {user && <div className="chat-success">✅ {text.successPrefix} {user.name}</div>}
        </div>

        <form className="input-area" onSubmit={handleSubmit}>
          <input
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            placeholder={text.placeholder}
            required
          />

          <div className="btn-area">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? text.loading : text.login}
            </button>

            <button type="button" className="signup-btn" onClick={handleSignup}>
              {text.signup}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;
