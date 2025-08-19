import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
 import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', role: 'parent' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } catch (error) {
      setMessage('Failed to fetch');
      console.error('Register error:', error);
    }
  };

  return (
    <Paper style={{ padding: 20 }}>
      <h2>Register</h2>
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
        <TextField
          select
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="parent">Parent</MenuItem>
          <MenuItem value="guardian">Guardian</MenuItem>
          <MenuItem value="volunteer">Volunteer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
      {message && <p>{message}</p>}
    </Paper>
  );
}

export default RegisterPage;
