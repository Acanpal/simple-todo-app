import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); // ログイン成功したらトップページへ
    } catch (err) {
      // エラーオブジェクトから詳細なメッセージを表示
      setError(err.error || 'ログインに失敗しました');
    }
  };

  return (
    <div className="container">
      <h1>ログイン</h1>
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
        <button type="submit" className="btn-primary">ログイン</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        アカウントをお持ちでない方は <Link to="/register">新規登録</Link> へ
      </p>
    </div>
  );
};
