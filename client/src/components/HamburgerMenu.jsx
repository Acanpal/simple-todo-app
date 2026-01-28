import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="メニューを開閉"
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      {/* メニューオーバーレイ */}
      <nav className={`menu-overlay ${isOpen ? 'open' : ''}`}>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/uncompleted" className="menu-link" onClick={toggleMenu}>未完了タスク</Link>
          </li>
          <li className="menu-item">
            <Link to="/completed" className="menu-link" onClick={toggleMenu}>完了済みタスク</Link>
          </li>
        </ul>
      </nav>

      {/* 背景クリックで閉じる用 */}
      {isOpen && <div className="menu-backdrop" onClick={toggleMenu}></div>}
    </>
  );
};
