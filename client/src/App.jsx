import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css'
import { Layout } from './components/Layout';
import { UncompletedPage } from './pages/UncompletedPage';
import { CompletedPage } from './pages/CompletedPage';
import { useTodos } from './hooks/useTodos';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const {
    uncompletedTodos,
    completedTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodoCompletion,
    reorderTodos,
  } = useTodos();

  // active.idとover.idを渡すラッパー
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) {
      reorderTodos(active.id, over.id);
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="uncompleted" replace />} /> {/* 未完了タスクページにリダイレクト */}
            <Route path="uncompleted" element={
              <UncompletedPage
                todos={uncompletedTodos} // 未完了のタスク
                handleAddTodo={addTodo} // 新規タスク追加用関数
                handleDelete={deleteTodo} // タスク削除用関数
                handleUpdate={updateTodo} // タスク更新用関数
                onToggle={toggleTodoCompletion} // タスク完了状態更新用関数
                handleDragEnd={handleDragEnd} // ドラッグ終了時の処理を渡す
              />
            } />
            <Route path="completed" element={
              <CompletedPage
                todos={completedTodos} // 完了のタスク
                handleDelete={deleteTodo} // タスク削除用関数
                handleUpdate={updateTodo} // タスク更新用関数
                onToggle={toggleTodoCompletion} // タスク完了状態更新用関数
              />
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
