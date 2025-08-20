import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
  Box,
} from '@mui/material';

/**
 * Enhanced admin dashboard.
 * Shows pending session requests with approve/reject controls and a user management panel.
 */
function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);

  // Use a gold accent color for cards so they are visible on a dark background
  const CARD_STYLE = { backgroundColor: '#FBC02D', color: '#000' };

  useEffect(() => {
    // Fetch all schedules and filter pending
    fetch('http://localhost:4000/api/schedules', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPending(data.filter((s) => s.status === 'pending'));
        } else {
          setPending([]);
        }
      })
      .catch(() => setPending([]));

    // Fetch all users
    fetch('http://localhost:4000/api/users', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]));
  }, [user]);

  const approve = async (id) => {
    await fetch(`http://localhost:4000/api/schedules/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const reject = async (id) => {
    await fetch(`http://localhost:4000/api/schedules/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await fetch(`http://localhost:4000/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      {/* Pending sessions panel */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Pending Sessions
        </Typography>
        {pending.length === 0 ? (
          <Typography>No pending sessions.</Typography>
        ) : (
          pending.map((session) => (
            <Card key={session.id} sx={{ mb: 2, ...CARD_STYLE }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Volunteer #{session.volunteerId} → Parent #{session.parentId}
                </Typography>
                <Typography variant="body2">
                  {new Date(session.startTime).toLocaleString()} –{' '}
                  {new Date(session.endTime).toLocaleString()}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => approve(session.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => reject(session.id)}
                  >
                    Reject
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
      {/* User management panel */}
      <Box>
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>
        {users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          users.map((u) => (
            <Card key={u.id} sx={{ mb: 2, ...CARD_STYLE }}>
              <CardContent>
                <Typography variant="body1">
                  {u.username} ({u.role})
                </Typography>
                {u.id !== user.id && (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete User
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}

export default AdminDashboard;