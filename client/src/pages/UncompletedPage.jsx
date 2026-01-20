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
  handleDragEnd
}) => {
  return (
    <>
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
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={todos}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list">
            {todos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>タスクはありません</p>
            ) : (
              todos.map((todo) => (
                <SortableItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
};
