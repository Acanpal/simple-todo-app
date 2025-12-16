import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import './App.css'
import { SortableItem } from './SortableItem'; // 作成したコンポーネントをインポート

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // dnd-kitのセンサー設定
  // PointerSensor (マウス/タッチ)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px以上ドラッグしたら開始 (クリックと区別するため)
      },
    }),
  );


  // データ取得
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/todos');
        if (!res.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error(err);
      }
    };

    // 非同期処理はuseEffect内で実行するそのまま実行しないほうが良い
    fetchTodos();
  }, []);

  // 追加ボタンを押した時の処理
  const handleAddTodo = async () => {
    if (!newTodo) return;

    try {
      const res = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });

      if (!res.ok) {
        throw new Error('サーバーエラーが発生しました');
      }

      const data = await res.json(); // 帰ってきたものをdataに格納(読み込み時間かかるのでawait)
      setTodos(data); // 最新のリストで画面更新(Stateの更新)
      setNewTodo(""); // 入力欄を空にする(Stateの更新)
    } catch (err) {
      // 上の throw new Error() で投げられたエラーも キャッチする
      console.error(err);
      alert("追加に失敗しました。もう一度試してください。");
    }
  };

  // 削除ボタンを押した時の処理
  const handleDelete = async (id) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('削除に失敗しました');
      }

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
      alert("削除できませんでした");
    }
  };

  // 更新(保存)ボタン処理
  // 引数で id と title を受け取るように変更
  const handleUpdate = async (id, newTitle) => {
    try {
      const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });

      if (!res.ok) {
        throw new Error('更新に失敗しました');
      }

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
      alert("更新できませんでした");
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = async (event) => { // dnd-kitのイベント
    const { active, over } = event;

    if (active.id !== over.id) {
      setTodos((items) => { // items: Reactの用意する、最新の配列
        const oldIndex = items.findIndex(item => item.id === active.id); // 配列内の元の位置
        const newIndex = items.findIndex(item => item.id === over.id); // 配列内の新しい位置

        // 配列の順序を入れ替え
        // Note: arrayMoveは新しい配列を返すので、イミュータブル性は保たれる
        const newItems = arrayMove(items, oldIndex, newIndex);

        // サーバーに順序保存リクエスト (非同期で投げる)
        // ここでは画面更新を待たずに投げる ("Optimistic UI" 的なアプローチ)
        // 本来はエラーハンドリングをしっかりやるべき
        fetch('http://localhost:3000/api/todos/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todos: newItems })
        }).catch(err => {
          console.error("順序保存に失敗しました", err);
          // エラーなら元の順序に戻す処理などが理想的
        });

        return newItems;
      });
    }
  };

  return (
    <div className="container">
      <h1 className="title">Todo リスト</h1>

      {/* 入力フォーム */}
      <div className="form">
        <input
          type="text"
          className="input"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddTodo();
          }}
          placeholder="新しいタスクを入力"
        />
        <button className="button" onClick={handleAddTodo}>追加</button>
      </div>

      <DndContext
        sensors={sensors} // さっき設定したセンサーを使う
        collisionDetection={closestCenter} // 中心が一番近い要素と置き換える
        onDragEnd={handleDragEnd} // ドラッグ終了時の処理
      >
        <SortableContext
          items={todos} // 並び替え対象のリスト
          strategy={verticalListSortingStrategy} // 垂直方向の並び替え 
        >
          <ul className="list">
            {todos.map((todo) => (
              <SortableItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default App
