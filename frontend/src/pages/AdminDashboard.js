import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';

/**
 * Admin dashboard showing pending session requests.
 */
function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/schedules', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setPending(data.filter((s) => s.status === 'pending')));
  }, [user]);

  const approve = async (id) => {
    await fetch(`http://localhost:4000/api/schedules/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPending(pending.filter((p) => p.id !== id));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Pending Sessions
      </Typography>
      <Grid container spacing={2}>
        {pending.map((session) => (
          <Grid item xs={12} md={6} key={session.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="subtitle1">
                  Volunteer #{session.volunteerId} → Parent #{session.parentId}
                </Typography>
                <Typography variant="body2">
                  {new Date(session.startTime).toLocaleString()} –{' '}
                  {new Date(session.endTime).toLocaleString()}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={() => approve(session.id)}>
                    Approve
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {pending.length === 0 && (
          <Grid item xs={12}>
            <Typography>No pending sessions.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
