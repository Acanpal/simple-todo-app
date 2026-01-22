import React from 'react';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../components/SortableItem';

export const UncompletedPage = ({
  todos,
  newTodo,
  setNewTodo,
  handleAddTodo,
  handleDelete,
  handleUpdate,
  sensors,
  handleDragEnd,
  onToggle
}) => {
  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>未完了タスク</h2>
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
          autoFocus // ページ読み込み時に自動的にフォーカスする
        />
        <button
          className="button" onClick={handleAddTodo} >追加</button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd} // ドラッグ終了時に実行される関数
      >
        <SortableContext
          items={todos}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list">
            {todos.length === 0 ? ( // 例外処理
              <p className="no-tasks">タスクはありません</p>
            ) : (
              todos.map((todo) => (
                <SortableItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onToggle={onToggle}
                />
              ))
            )}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
};
