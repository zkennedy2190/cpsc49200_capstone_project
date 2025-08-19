import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { AuthContext } from '../AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // fetch notifications logic remains unchanged

  const handleBellClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMarkRead = async (id) => {
    // mark notifications as read...
  };

  // navLink uses the matte black contained button style from the theme
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
          {/* Updated title with subtitle in one line */}
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            StoryBridge – Aunt Mary’s Storybook Portal
          </Typography>
          {/* Show Login/Register buttons if no user */}
          {!user && (
            <>
              {navLink('/login', 'Login')}
              {navLink('/register', 'Register')}
            </>
          )}
          {/* Role‑specific navigation remains as before */}
          {user?.role === 'volunteer' && navLink('/volunteer', 'Volunteer Dashboard')}
          {user?.role === 'volunteer' && navLink('/schedule', 'Schedule')}
          {user?.role === 'parent' && navLink('/parent', 'Parent Dashboard')}
          {user?.role === 'guardian' && navLink('/guardian', 'Guardian Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin Dashboard')}
          {user && (
            <>
              {navLink('/recordings', 'Recordings')}
              {navLink('/books', 'Books')}
              {/* Notifications bell */}
              <IconButton color="inherit" onClick={handleBellClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {/* Logout icon restored */}
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
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
