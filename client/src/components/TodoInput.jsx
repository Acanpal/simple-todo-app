import React from 'react';

export const TodoInput = ({ value, onChange, onAdd }) => {
  return (
    <div className="form">
      <input
        type="text"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onAdd();
        }}
        placeholder="新しいタスクを入力"
        autoFocus
      />
      <button className="button" onClick={onAdd}>追加</button>
    </div>
  );
};