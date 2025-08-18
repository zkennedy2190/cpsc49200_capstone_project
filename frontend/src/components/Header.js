import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Header() {
  const { role } = useContext(AuthContext);

  return (
    <header className="app-header">
      <h1>Aunt Mary’s Storybook Portal</h1>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/volunteer">Volunteer Dashboard</Link> |{' '}
        <Link to="/admin">Admin Dashboard</Link> |{' '}
        {/* Only show schedule link for volunteers */}
        {role === 'volunteer' && (
          <>
            <Link to="/schedule">Schedule</Link> |{' '}
          </>
        )}
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}

export default Header;
