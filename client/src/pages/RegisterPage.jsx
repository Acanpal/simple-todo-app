import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      // 登録成功したらそのまま自動ログイン
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.error || '登録に失敗しました');
    }
  };

  return (
    <div className="container">
      <h1>新規登録</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn-primary">登録する</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link> へ
      </p>
    </div>
  );
};
