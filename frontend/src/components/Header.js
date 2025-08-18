import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <h1>Aunt Mary’s Storybook Portal</h1>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/volunteer">Volunteer Dashboard</Link> |{' '}
        <Link to="/admin">Admin Dashboard</Link>
        <Link to="/parent">Parent Dashboard</Link>
        <Link to="/guardian">Guardian Dashboard</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}

export default Header;
