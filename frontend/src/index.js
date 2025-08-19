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
      {/* Enhanced textured background */}
      <GlobalStyles
        styles={{
          body: {
            backgroundImage:
              'repeating-linear-gradient(45deg, #1c1c1c 0px, #1c1c1c 3px, #212121 3px, #212121 6px)',
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
