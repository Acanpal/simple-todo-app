import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './SortableItem.css'; // スタイルをインポート


export function SortableItem({ todo, onUpdate, onDelete, onToggle }) {
  // 編集モードの状態をこのコンポーネント内で管理する
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [isFading, setIsFading] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || (isFading ? 'opacity 2000ms ease-out' : undefined),
    opacity: isFading ? 0 : (transform ? 0.5 : 1),
  };

  // 編集モード開始
  const handleEditStart = () => {
    setIsEditing(true);
    setEditText(todo.title);
  };

  // 編集キャンセル
  const handleCancel = () => {
    setIsEditing(false);
    setEditText("");
  };

  // 保存処理
  const handleSave = () => {
    if (editText.trim() === "") return; // 空文字チェック
    onUpdate(todo.id, editText); // 親から渡された更新関数を呼ぶ
    setIsEditing(false);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked && !todo.completed) {
      // 未完了 -> 完了 (フェードアウトあり)
      setIsFading(true);
      setTimeout(() => {
        onToggle(todo.id, true);
        // setIsFading(false) はコンポーネントが移動/アンマウントされるので不要だが、
        // 万が一のためにリセットするならここ。
      }, 2000);
    } else {
      // 完了 -> 未完了 (即時) またはチェック外し
      onToggle(todo.id, checked);
      setIsFading(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="sortable-card">
      {/* ドラッグハンドル */}
      <div {...listeners} className="drag-handle">
      </div>

      {/* コンテンツエリア */}
      <div className="sortable-content">
        <li className="item">
          {isEditing ? (
            // 編集モード
            <>
              <input
                type="checkbox"
                className="checkbox"
                checked={todo.completed}
                disabled
              />
              <input
                type="text"
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSave} // 外をクリックしたら保存
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
                // ドラッグ競合回避
                onPointerDown={(e) => e.stopPropagation()}
              />
              <button
                className="delete-button"
                onClick={() => onDelete(todo.id)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                削除
              </button>
            </>
          ) : (
            // 通常モード
            <>
              <input
                type="checkbox"
                className="checkbox"
                checked={todo.completed}
                onChange={handleCheckboxChange}
                onPointerDown={(e) => e.stopPropagation()} // ドラッグ回避
              />
              <span
                onClick={handleEditStart}
                style={{ cursor: 'pointer', flexGrow: 1 }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {todo.title}
              </span>
              <button
                className="delete-button"
                onClick={() => onDelete(todo.id)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                削除
              </button>
            </>
          )}
        </li>
      </div>
    </div>
  );
}
