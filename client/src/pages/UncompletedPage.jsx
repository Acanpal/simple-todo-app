import { useState } from 'react';

import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableTodoItem } from '../components/SortableTodoItem';
import { TodoInput } from '../components/TodoInput';

export const UncompletedPage = ({
  todos,
  handleAddTodo,
  handleDelete,
  handleUpdate,
  handleDragEnd,
  onToggle
}) => {
  const [newTodo, setNewTodo] = useState('');

  // dnd-kitのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

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
                <SortableTodoItem
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
