import React from 'react';
import Paper from '@mui/material/Paper';

function HomePage() {
  return (
    <Paper style={{ padding: 20 }}>
      <h2>Welcome to Aunt Mary’s Storybook Portal</h2>
      <p>
        Please use the navigation links above to log in, register, view recordings, schedule sessions,
        or manage your dashboard based on your role.
      </p>
    </Paper>
  );
}

export default HomePage;