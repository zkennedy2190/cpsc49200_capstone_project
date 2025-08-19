import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4f8a8b',
    },
    secondary: {
      main: '#b8860b',
    },
    background: {
      default: '#1e1e1e',
      paper:   '#2c2c2c',
    },
  },
  typography: {
    // Set a more friendly global font
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#000',
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#222',
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

export default theme;
