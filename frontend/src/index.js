import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Subtle texture on the dark background */}
      <GlobalStyles
        styles={{
          body: {
            backgroundImage:
              'repeating-linear-gradient(45deg, #1d1d1d 0px, #1d1d1d 4px, #1f1f1f 4px, #1f1f1f 8px)',
            backgroundColor: '#1e1e1e',
          },
        }}
      />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
