import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 認証確認用ルート
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  // ローディング中は何も表示しない、またはスピナーを表示
  if (loading) {
    return <div>Loading...</div>;
  }
  // ログインしていなければログインページへリダイレクト
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // 認証済みなら子要素を表示
  return children;
};
