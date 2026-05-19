import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/shops', label: '🏪 Shops' },
    { path: '/orders', label: '📦 Orders' },
    { path: '/coupons', label: '🎟️ Coupons' },
    { path: '/reports', label: '📈 Reports' },
  ];

  return (
    <nav className="navbar sticky-top" style={{ backgroundColor: '#1e3a5f', padding: '10px 16px', zIndex: 999 }}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <span className="text-white fw-bold fs-6">🛒 Sales Manager</span>
        <div className="d-flex align-items-center gap-2">
          <span className="text-white-50 small d-none d-md-inline">👤 {user?.name}</span>
          <button className="d-lg-none btn btn-sm btn-outline-light" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
          <div className="d-none d-lg-flex gap-2 align-items-center">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`btn btn-sm ${location.pathname === link.path ? 'btn-warning text-dark fw-bold' : 'btn-outline-light'}`}
              >
                {link.label}
              </Link>
            ))}
            <button className="btn btn-sm btn-outline-danger ms-2" onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="w-100 mt-2 d-flex flex-column gap-2 d-lg-none">
          <div className="text-white-50 small px-1">👤 {user?.name}</div>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`btn ${location.pathname === link.path ? 'btn-warning text-dark fw-bold' : 'btn-outline-light'}`}
            >
              {link.label}
            </Link>
          ))}
          <button className="btn btn-outline-danger" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;