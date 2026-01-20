import React from 'react';
import { Outlet } from 'react-router-dom';
import { HamburgerMenu } from './HamburgerMenu';

export const Layout = () => {
  return (
    <div className="container">
      <HamburgerMenu />
      <h1 className="title">Todo リスト</h1>
      <Outlet />
    </div>
  );
};
