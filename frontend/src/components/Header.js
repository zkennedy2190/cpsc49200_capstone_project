import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;

  return (
    <header className="app-header">
      <h1>Aunt Mary’s Storybook Portal</h1>
      <nav>
        <Link to="/">Home</Link>
        {!user && (
          <>
            {' | '}
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
        {role === 'volunteer' && (
          <>
            {' | '}
            <Link to="/volunteer">Volunteer Dashboard</Link> | <Link to="/schedule">Schedule</Link>
          </>
        )}
        {role === 'parent' && (
          <>
            {' | '}
            <Link to="/parent">Parent Dashboard</Link>
          </>
        )}
        {role === 'guardian' && (
          <>
            {' | '}
            <Link to="/guardian">Guardian Dashboard</Link>
          </>
        )}
        {role === 'admin' && (
          <>
            {' | '}
            <Link to="/admin">Admin Dashboard</Link>
          </>
        )}
        {' | '}
        <Link to="/recordings">Recordings</Link> | <Link to="/book-selection">Books</Link>
        {user && (
          <>
            {' | '}
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;