import React, { useState } from 'react';
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
          <li className="menu-item" onClick={toggleMenu}>ホーム</li>
          <li className="menu-item" onClick={toggleMenu}>設定</li>
          <li className="menu-item" onClick={toggleMenu}>ログアウト</li>
        </ul>
      </nav>

      {/* 背景クリックで閉じる用 */}
      {isOpen && <div className="menu-backdrop" onClick={toggleMenu}></div>}
    </>
  );
};
