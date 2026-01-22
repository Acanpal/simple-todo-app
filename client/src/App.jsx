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

  // 更新(completedの変更、タイトル編集)処理
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
    if (!over || active.id === over.id) return; //ドラッグ先がない、または移動先が移動元と同じなら何もしない

    const previousItems = todos; // ロールバック用

    const uncompleted = todos.filter(t => !t.completed); // 未完了のタスクのみ 抽出
    const completed = todos.filter(t => t.completed); // 完了のタスクのみ抽出

    const oldIndex = uncompleted.findIndex(i => i.id === active.id); // 持っているidのインデックス
    const newIndex = uncompleted.findIndex(i => i.id === over.id); // over(重なってる)idのインデックス

    const reorderedUncompleted = arrayMove(uncompleted, oldIndex, newIndex); // 未完了のタスクの並び替え

    // 全体を結合 (未完了の並び替え + 完了済み)
    const newItems = [...reorderedUncompleted, ...completed];

    setTodos(newItems); // 先にUIを更新(Optimistic UI)
    saveOrder(newItems, previousItems); // あとからAPIを叩く
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
              todos={uncompletedTodos} // 未完了のタスク
              newTodo={newTodo} // 新規タスク
              setNewTodo={setNewTodo} // 新規タスクのState更新用関数
              handleAddTodo={handleAddTodo} // 新規タスク追加用関数
              handleDelete={handleDelete} // タスク削除用関数
              handleUpdate={handleUpdate} // タスク更新用関数
              onToggle={handleToggleCompletion} // タスク完了状態更新用関数
              sensors={sensors} // dnd-kitのセンサー設定を渡す
              handleDragEnd={handleDragEnd} // ドラッグ終了時の処理を渡す
            />
          } />
          <Route path="completed" element={
            <CompletedPage
              todos={completedTodos} // 完了のタスク
              handleDelete={handleDelete} // タスク削除用関数
              handleUpdate={handleUpdate} // タスク更新用関数
              onToggle={handleToggleCompletion} // タスク完了状態更新用関数
            />
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
