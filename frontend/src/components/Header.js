// frontend/src/components/Header.js
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
import { apiFetch } from '../api';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);    // always an array
  const [anchorEl, setAnchorEl] = useState(null);

  const loadNotifications = async () => {
    if (!user?.token) {
      setNotifications([]);
      return;
    }
    try {
      const res = await apiFetch('/api/notifications', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = typeof res?.json === 'function' ? await res.json() : res;
      setNotifications(Array.isArray(data) ? data : []);      // guard against 401/403/HTML
    } catch {
      setNotifications([]);                                   // network or 4xx/5xx → empty list
    }
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.token]);

  const handleBellClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMarkRead = async (id) => {
    if (!user?.token) return;
    try {
      await apiFetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications((prev) =>
        Array.isArray(prev) ? prev.filter((n) => n.id !== id) : []
      );
    } catch {
      // ignore; keep UI responsive
    }
  };

  const navLink = (to, label) => (
    <Button component={Link} to={to} variant="contained" sx={{ ml: 1 }}>
      {label}
    </Button>
  );

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read && !n.isRead).length
    : 0;

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
          <Box sx={{ flexGrow: 1 }} />
          {!user && (
            <>
              {navLink('/login', 'Login')}
              {navLink('/register', 'Register')}
            </>
          )}
          {user?.role === 'volunteer' && navLink('/volunteer', 'Volunteer Dashboard')}
          {user?.role === 'volunteer' && navLink('/schedule', 'Schedule')}
          {user?.role === 'volunteer' && navLink('/record', 'Record')}
          {user?.role === 'parent' && navLink('/parent', 'Parent Dashboard')}
          {user?.role === 'guardian' && navLink('/guardian', 'Guardian Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin Dashboard')}
          {user && (
            <>
              {navLink('/recordings', 'Recordings')}
              {navLink('/books', 'Books')}
              <IconButton color="inherit" onClick={handleBellClick}>
                <Badge badgeContent={unreadCount} color="error">
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
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map((n) => (
            <MenuItem key={n.id} onClick={() => handleMarkRead(n.id)}>
              {n.message}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleMenuClose}>No notifications</MenuItem>
        )}
      </Menu>
    </>
  );
}

export default Header;
