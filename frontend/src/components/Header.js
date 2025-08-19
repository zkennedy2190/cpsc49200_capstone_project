import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import { AuthContext } from '../AuthContext';

/**
 * Header that displays navigation links, notifications and logout.
 * The title next to the home button has been removed as requested.
 */
function Header() {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch notifications on user change
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

  const handleBellClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMarkRead = async (id) => {
    await fetch(`http://localhost:4000/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Create a matte black navigation button using the theme's contained style
  const navLink = (to, label) => (
    <Button component={Link} to={to} variant="contained" sx={{ ml: 1 }}>
      {label}
    </Button>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(to bottom, #f3c13a, #d6a90b 60%, #b8860b)',
          color: 'black',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" component={Link} to="/">
            <HomeIcon />
          </IconButton>
          {/* Spacer to push navigation items to the right */}
          <Box sx={{ flexGrow: 1 }} />
          {!user && (
            <>
              {navLink('/login', 'Login')}
              {navLink('/register', 'Register')}
            </>
          )}
          {user?.role === 'volunteer' && navLink('/volunteer', 'Volunteer Dashboard')}
          {user?.role === 'volunteer' && navLink('/schedule', 'Schedule')}
          {user?.role === 'parent' && navLink('/parent', 'Parent Dashboard')}
          {user?.role === 'guardian' && navLink('/guardian', 'Guardian Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin Dashboard')}
          {user && (
            <>
              {navLink('/recordings', 'Recordings')}
              {navLink('/books', 'Books')}
              <IconButton color="inherit" onClick={handleBellClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      {/* Notifications dropdown */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {notifications.length === 0 && (
          <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
        )}
        {notifications.map((n) => (
          <MenuItem key={n.id} onClick={() => handleMarkRead(n.id)}>
            {n.message}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default Header;
