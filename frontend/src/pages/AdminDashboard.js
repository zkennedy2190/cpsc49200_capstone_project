import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';

/**
 * Admin dashboard showing pending session requests and user management.
 */
function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all schedules for pending approvals
    fetch('http://localhost:4000/api/schedules', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setPending(
          Array.isArray(data) ? data.filter((s) => s.status === 'pending') : []
        )
      );

    // Fetch all users for management
    fetch('http://localhost:4000/api/users', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  }, [user]);

  const approve = async (id) => {
    await fetch(`http://localhost:4000/api/schedules/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Pending Sessions
        </Typography>
        {pending.length === 0 ? (
          <Typography>No pending sessions.</Typography>
        ) : (
          pending.map((session) => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  Volunteer #{session.volunteerId} → Parent #{session.parentId}
                </Typography>
                <Typography variant="body2">
                  {new Date(session.startTime).toLocaleString()} –{' '}
                  {new Date(session.endTime).toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => approve(session.id)}
                >
                  Approve
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>
        {users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          users.map((u) => (
            <Card key={u.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  {u.username} ({u.role})
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => deleteUser(u.id)}
                >
                  Delete User
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}

export default AdminDashboard;
