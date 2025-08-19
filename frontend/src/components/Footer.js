// frontend/src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Footer fixed to the bottom of the screen on every page.
 * It uses transparent background to blend with the dark theme.
 */
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        py: 1,
        textAlign: 'center',
        // Adjust color as needed for readability on dark background
        color: '#fff',
        // Transparent background allows the underlying dark texture to show through
        backgroundColor: 'transparent',
      }}
    >
      <Typography variant="body2">
        © 2025 StoryBridge - Aunt Mary's Storybook Project
      </Typography>
    </Box>
  );
}

export default Footer;
