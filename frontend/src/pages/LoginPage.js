import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        // Redirect based on the user's role
        if (data.role === 'parent') navigate('/parent');
        else if (data.role === 'guardian') navigate('/guardian');
        else if (data.role === 'volunteer') navigate('/volunteer');
        else if (data.role === 'admin') navigate('/admin');
        // Reset form and message
        setForm({ username: '', password: '' });
        setMessage('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to fetch');
      console.error('Login error:', error);
    }
  };

  return (
    <Paper style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      {message && <p>{message}</p>}
    </Paper>
  );
}

export default LoginPage;
