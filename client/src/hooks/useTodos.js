// client/src/hooks/useTodos.js
import { useState, useEffect } from 'react';
import { apiFetch } from '../api/apiFetch';
import { errorMessage } from '../utils/errorMessage';
import { arrayMove } from '@dnd-kit/sortable';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);

  // 初期データ読み込み
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await apiFetch('http://localhost:3000/api/todos');
        setTodos(res);
      } catch (err) {
        console.error(err);
        alert(errorMessage(err.code));
      }
    };
    fetchTodos();
  }, []);

  // 追加
  const addTodo = async (title) => {
    if (!title.trim()) {
      alert("文字を入力してください");
      return;
    }
    try {
      const res = await apiFetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title: title })
      });
      setTodos(res);
    } catch (err) {
      console.error(err);
      alert(errorMessage(err.code));
    }
  };

  // 削除
  const deleteTodo = async (id) => {
    if (!confirm("本当に削除しますか？")) return;
    try {
      const res = await apiFetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(res);
    } catch (err) {
      console.error(err);
      alert(errorMessage(err.code));
    }
  };

  // 更新
  const updateTodo = async (id, newTitle) => {
    try {
      const res = await apiFetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: newTitle })
      });
      setTodos(res);
    } catch (err) {
      console.error(err);
      alert(errorMessage(err.code));
    }
  };

  // 完了状態切り替え
  const toggleTodoCompletion = async (id, completed) => {
    try {
      const res = await apiFetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed })
      });
      setTodos(res);
    } catch (err) {
      console.error(err);
      alert(errorMessage(err.code));
    }
  };

  // 並び順保存
  const saveOrder = async (newItems, previousItems) => {
    try {
      await apiFetch('http://localhost:3000/api/todos/reorder', {
        method: 'PUT',
        body: JSON.stringify({ todos: newItems }),
      });
    } catch (err) {
      console.error(err);
      setTodos(previousItems);
      alert(errorMessage(err.code));
    }
  };

  // ドラッグ終了処理
  const reorderTodos = (activeId, overId) => {
    if (activeId === overId) return;

    const previousItems = todos;
    const uncompleted = todos.filter(t => !t.completed);
    const completed = todos.filter(t => t.completed);

    const oldIndex = uncompleted.findIndex(i => i.id === activeId);
    const newIndex = uncompleted.findIndex(i => i.id === overId);

    const reorderedUncompleted = arrayMove(uncompleted, oldIndex, newIndex);
    const newItems = [...reorderedUncompleted, ...completed];

    setTodos(newItems);
    saveOrder(newItems, previousItems);
  };

  // フィルタリング
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return {
    uncompletedTodos,
    completedTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodoCompletion,
    reorderTodos,
  };
};