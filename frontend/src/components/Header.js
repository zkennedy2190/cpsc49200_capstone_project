// frontend/src/components/Header.js
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;

  // State to store unread notifications and dropdown anchor
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch unread notifications when user logs in or changes
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    fetch('http://localhost:4000/api/notifications', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]));
  }, [user]);

  // Open the notifications menu
  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the notifications menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="app-header" style={{ padding: '1rem' }}>
      <h1>Aunt Mary’s Storybook Portal</h1>
      <nav>
        <Link to="/">Home</Link>

        {/* Links for unauthenticated users */}
        {!user && (
          <>
            {' | '}
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}

        {/* Links for volunteers */}
        {role === 'volunteer' && (
          <>
            {' | '}
            <Link to="/volunteer">Volunteer Dashboard</Link> |{' '}
            <Link to="/schedule">Schedule</Link>
          </>
        )}

        {/* Links for parents */}
        {role === 'parent' && (
          <>
            {' | '}
            <Link to="/parent">Parent Dashboard</Link>
          </>
        )}

        {/* Links for guardians */}
        {role === 'guardian' && (
          <>
            {' | '}
            <Link to="/guardian">Guardian Dashboard</Link>
          </>
        )}

        {/* Links for admins */}
        {role === 'admin' && (
          <>
            {' | '}
            <Link to="/admin">Admin Dashboard</Link>
          </>
        )}

        {/* Common links for authenticated users */}
        {' | '}
        <Link to="/recordings">Recordings</Link> |{' '}
        <Link to="/book-selection">Books</Link>

        {/* Show notifications and logout if logged in */}
        {user && (
          <>
            {' | '}
            <button onClick={logout}>Logout</button>

            {/* Notifications bell */}
            <IconButton color="inherit" onClick={handleBellClick}>
              <NotificationsIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {notifications.length === 0 ? (
                <MenuItem>No new notifications</MenuItem>
              ) : (
                notifications.map((n) => (
                  <MenuItem key={n.id}>{n.message}</MenuItem>
                ))
              )}
            </Menu>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;