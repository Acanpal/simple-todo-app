import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import { Layout } from './components/Layout';
import { UncompletedPage } from './pages/UncompletedPage';
import { CompletedPage } from './pages/CompletedPage';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    todos,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodoCompletion,
    reorderTodos,
  } = useTodos();

  // dnd-kitのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // active.idとover.idを渡すラッパー
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) {
      reorderTodos(active.id, over.id);
    }
  };

  // フィルタリング (毎レンダリングごとに行う)
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="uncompleted" element={
            <UncompletedPage
              todos={uncompletedTodos} // 未完了のタスク
              handleAddTodo={addTodo} // 新規タスク追加用関数
              handleDelete={deleteTodo} // タスク削除用関数
              handleUpdate={updateTodo} // タスク更新用関数
              onToggle={toggleTodoCompletion} // タスク完了状態更新用関数
              sensors={sensors} // dnd-kitのセンサー設定を渡す
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
    </BrowserRouter>
  )
}

export default App;
