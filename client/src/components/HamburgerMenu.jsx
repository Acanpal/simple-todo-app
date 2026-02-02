import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HamburgerMenu.css';

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const { logout } = useAuth(); // AuthContextからlogout関数を取得
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
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
          {/* 区切り線 */}
          <hr style={{ width: '80%', borderColor: '#444', margin: '20px auto' }} />
          <li className="menu-item">
            <button
              className="menu-link"
              onClick={handleLogout}
              style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 'inherit' }}
            >
              ログアウト
            </button>
          </li>
        </ul>
      </nav>

      {/* 背景クリックで閉じる用 */}
      {isOpen && <div className="menu-backdrop" onClick={toggleMenu}></div>}
    </>
  );
};
