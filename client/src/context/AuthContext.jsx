import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/apiFetch';

const AuthContext = createContext(); // グローバル変数的な

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初回ロード時にトークンがあるか確認
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 本来はここで /api/auth/me などを呼んでユーザー情報を取得すべきだが
      // 今回は簡易的に「トークンがあればログイン済み」とみなす
      // またはデコードしてuserIdを取り出すなどの処理を入れる
      setUser({ token });
    }
    setLoading(false);
  }, []);

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

  const register = async (email, password) => {
    const res = await apiFetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // 登録後は自動ログインさせるか、ログインページへ飛ばすかはUI次第
    // ここでは登録成功のみを返す
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
