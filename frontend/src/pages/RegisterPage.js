import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', role: 'parent' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setForm({ username: '', password: '', role: 'parent' });
      }
    } catch {
      setMessage('Registration failed');
    }
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
            Register
          </Typography>
          {message && (
            <Alert severity={message.includes('registered') ? 'success' : 'error'}>
              {message}
            </Alert>
          )}
          <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#000' },
                  '&:hover fieldset': { borderColor: '#222' },
                  '&.Mui-focused fieldset': { borderColor: '#000' },
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#000' },
                  '&:hover fieldset': { borderColor: '#222' },
                  '&.Mui-focused fieldset': { borderColor: '#000' },
                },
              }}
            />
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#000' },
                  '&:hover fieldset': { borderColor: '#222' },
                  '&.Mui-focused fieldset': { borderColor: '#000' },
                },
              }}
            >
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={form.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="guardian">Guardian</MenuItem>
                <MenuItem value="volunteer">Volunteer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" type="submit">
              Register
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default RegisterPage;
