import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/apiFetch';

const AuthContext = createContext(); // グローバル変数的な

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User情報(現在はtokenのみ)
  const [loading, setLoading] = useState(true); // 認証チェック中フラグ

  // 初回ロード時にトークンがあるか確認
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      //tokenにはUserIdが含まれる(本来はUserIDを入れるべき)
      setUser({ token });
    }
    setLoading(false);
  }, []);

  // ログイン保存用API (POST)
  const login = async (email, password) => {
    const res = await apiFetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // トークンを保存
    localStorage.setItem('token', res.token);
    setUser({ token: res.token });
    return res;
  };

  // 新規登録用API (POST)
  const register = async (email, password) => {
    const res = await apiFetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // 登録後は自動ログインさせるか、ログインページへ飛ばすかはUI次第
    // ここでは登録成功のみを返す
    return res;
  };

  // ログアウト用API
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // アプリで使える値(グローバル変数)
  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* ローディング中は表示しない */}
    </AuthContext.Provider>
  );
};
