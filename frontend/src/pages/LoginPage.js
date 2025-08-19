import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  InputAdornment,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login({ token: data.token, role: data.role, id: data.id });
        setForm({ username: '', password: '' });
        setMessage('');
        if (data.role === 'parent') navigate('/parent');
        else if (data.role === 'guardian') navigate('/guardian');
        else if (data.role === 'volunteer') navigate('/volunteer');
        else if (data.role === 'admin') navigate('/admin');
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage('Login failed');
    }
  };

  // Styling: black text, labels and icons; black border; subtle hover highlight
  const fieldStyles = {
    '& .MuiInputBase-input': { color: '#000' },
    '& .MuiInputLabel-root': { color: '#000' },
    '& .MuiSvgIcon-root': { color: '#000' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#333',
    },
    '& .MuiOutlinedInput-root:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#000',
    },
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card
        elevation={3}
        sx={{
          background: 'linear-gradient(to bottom, #f3c13a, #d6a90b 60%, #b8860b)',
          color: 'black',
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          {message && <Alert severity="error">{message}</Alert>}
          <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              sx={fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              sx={fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" type="submit">
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginPage;
