import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <h1>Aunt Mary’s Storybook Portal</h1>
      <nav>
        <Link to="/" className="link">Home</Link> |{' '}
        <Link to="/volunteer" className="link">Volunteer Dashboard</Link> |{' '}
        <Link to="/admin" className="link">Admin Dashboard</Link>
      </nav>
    </header>
  );
}

export default Header;
