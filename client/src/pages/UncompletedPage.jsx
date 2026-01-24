import { useState } from 'react';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../components/SortableItem';
import { TodoInput } from '../components/TodoInput';

export const UncompletedPage = ({
  todos,
  handleAddTodo,
  handleDelete,
  handleUpdate,
  sensors,
  handleDragEnd,
  onToggle
}) => {
  const [newTodo, setNewTodo] = useState('');

  // handleAddTodoを呼び出し、newTodoを渡すためのラッパー
  const onAdd = () => {
    handleAddTodo(newTodo);
    setNewTodo('');
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>未完了タスク</h2>
      <TodoInput
        value={newTodo}
        onChange={setNewTodo}
        onAdd={onAdd}
      />

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
