import React from 'react';
import { SortableTodoItem } from '../components/SortableTodoItem';

export const CompletedPage = ({ todos, handleDelete, handleUpdate, onToggle }) => {
  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>完了済みタスク</h2>
      <ul className="list">
        {todos.length === 0 ? (
          <p className="no-tasks">完了したタスクはありません</p>
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
    </>
  );
};
