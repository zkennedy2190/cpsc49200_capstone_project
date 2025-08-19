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
  // (existing state, useEffect and helper functions remain unchanged)

  // navLink function remains unchanged, using matte black buttons

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
          {/* Updated title */}
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            StoryBridge
          </Typography>
          {/* ...navigation buttons and icons... */}
        </Toolbar>
      </AppBar>
      {/* ...menu for notifications remains unchanged... */}
    </>
  );
}

export default Header;
