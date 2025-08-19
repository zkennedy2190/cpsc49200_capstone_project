// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import theme from './theme';

// Create the root element for the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application with the custom theme, global styles and routing
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Apply a textured dark background and padding for the fixed footer */}
      <GlobalStyles
        styles={{
          body: {
            backgroundImage:
              'repeating-linear-gradient(45deg, #1c1c1c 0px, #1c1c1c 3px, #212121 3px, #212121 6px)',
            backgroundColor: '#1e1e1e',
            paddingBottom: '3rem', // reserve space for the footer at the bottom
          },
        }}
      />
      {/* Wrap the App in BrowserRouter for routing */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
