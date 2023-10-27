import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside>
      <a className="logo" href="/">Spyshark.io</a>
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <i className="fa-solid fa-grip-vertical"></i>
          <a>Dashboard</a>
        </Link>
        <Link to="/sales-tracker" className={location.pathname === '/sales-tracker' || location.pathname === '/sales-tracker/store' ? 'active' : ''}>
          <i className="fa-solid fa-chart-column"></i>
          <a>Sales Tracker</a>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
