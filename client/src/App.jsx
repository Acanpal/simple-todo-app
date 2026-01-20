import { useState, useEffect } from 'react'
import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
} from '@dnd-kit/sortable';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import { Layout } from './components/Layout';
import { UncompletedPage } from './pages/UncompletedPage';
import { CompletedPage } from './pages/CompletedPage';
import { apiFetch } from './utils/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // dnd-kitのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // 初回表示時のデータ取得処理
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await apiFetch('http://localhost:3000/api/todos');
        setTodos(result);
      } catch (err) {
        console.error(err);
        let message;
        switch (err.message) {
          case 'FAILED_TO_GET_DATA':
            message = 'データの取得に失敗しました';
            break;
          case 'NETWORK_ERROR':
            message = 'ネットワーク接続に失敗しました';
            break;
          default:
            message = 'サーバーから想定外の応答がありました';
        }
        alert(message);
      };
    };
    fetchTodos();
  }, []);

  // 追加ボタン処理
  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      alert("文字を入力してください");
      setNewTodo("");
      return;
    }

    try {
      const result = await apiFetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title: newTodo })
      });

      setTodos(result);
      setNewTodo("");
    } catch (err) {
      console.error(err);
      let message;
      switch (err.message) {
        case 'INVALID_TITLE': message = 'タイトルが不正です'; break;
        case 'TODO_CREATE_FAILED': message = 'タスクの保存に失敗しました'; break;
        case 'NETWORK_ERROR': message = 'ネットワーク接続に失敗しました'; break;
        default: message = '予期せぬエラーが発生しました';
      }
      alert(message);
    }
  };

  // 削除ボタン処理
  const handleDelete = async (id) => {
    if (!confirm("本当に削除しますか？")) return;
    try {
      const result = await apiFetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(result);
    } catch (err) {
      console.error(err);

      // エラーメッセージの分岐
      let message;
      switch (err.message) {
        case 'TODO_DELETE_FAILED':
          message = 'タスクの削除に失敗しました';
          break;
        case 'NETWORK_ERROR':
          message = 'ネットワーク接続に失敗しました';
          break;
        default:
          message = '予期せぬエラーが発生しました';
      }

      alert(message);
    }
  };

  // 更新(編集)処理
  const handleUpdate = async (id, newTitle) => {
    try {
      const result = await apiFetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: newTitle })
      });
      setTodos(result);
    } catch (err) {
      console.error(err);

      let message;
      switch (err.message) {
        case 'TODO_UPDATE_FAILED':
          message = 'タスクの更新に失敗しました';
          break;
        case 'NETWORK_ERROR':
          message = 'ネットワーク接続に失敗しました';
          break;
        default:
          message = '予期せぬエラーが発生しました';
      }

      alert(message);
    }
  };

  // 完了状態の切り替え
  const handleToggleCompletion = async (id, completed) => {
    try {
      const result = await apiFetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed })
      });
      setTodos(result);
    } catch (err) {
      console.error(err);
      alert('ステータスの更新に失敗しました');
    }
  };

  // 順序保存API呼び出し
  const saveOrder = async (newItems, previousItems) => {
    try {
      await apiFetch('http://localhost:3000/api/todos/reorder', {
        method: 'PUT',
        body: JSON.stringify({ todos: newItems }),
      });
    } catch (err) {
      console.error(err);
      setTodos(previousItems);

      // ユーザー通知
      switch (err.message) {
        case 'NETWORK_ERROR':
          alert('ネットワークエラーのため順序を保存できませんでした');
          break;
        case 'INVALID_PAYLOAD':
        case 'INVALID_TODO_DATA':
          alert('データが不正です');
          break;
        default:
          alert('並び順の保存に失敗しました');
      }
    }
  };

  // ドラッグ終了時
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const previousItems = todos;

    // 未完了タスクだけのリストを作成して並び替えを行う
    // 注意: 完了タスクは並び替えの影響を受けずにリストの最後にそのまま残す方針にします
    const uncompleted = todos.filter(t => !t.completed);
    const completed = todos.filter(t => t.completed);

    const oldIndex = uncompleted.findIndex(i => i.id === active.id);
    const newIndex = uncompleted.findIndex(i => i.id === over.id);

    const reorderedUncompleted = arrayMove(uncompleted, oldIndex, newIndex);

    // 全体を結合 (未完了の並び替え + 完了済み)
    const newInfos = [...reorderedUncompleted, ...completed];

    setTodos(newInfos);
    saveOrder(newInfos, previousItems);
  };

  // フィルタリング
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="uncompleted" element={
            <UncompletedPage
              todos={uncompletedTodos}
              newTodo={newTodo}
              setNewTodo={setNewTodo}
              handleAddTodo={handleAddTodo}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              onToggle={handleToggleCompletion}
              sensors={sensors}
              handleDragEnd={handleDragEnd}
            />
          } />
          <Route path="completed" element={
            <CompletedPage
              todos={completedTodos}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              onToggle={handleToggleCompletion}
            />
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
