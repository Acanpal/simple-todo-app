import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // ローディング中は何も表示しない、またはスピナーを表示
    return <div>Loading...</div>;
  }

  if (!user) {
    // ログインしていなければログインページへリダイレクト
    return <Navigate to="/login" replace />;
  }

  return children;
};
