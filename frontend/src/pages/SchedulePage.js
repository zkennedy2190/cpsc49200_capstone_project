import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Stack,
  Grid,
} from '@mui/material';

/**
 * Schedule creation and display page for volunteers.
 */
function SchedulePage() {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [parentId, setParentId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [averages, setAverages] = useState({});

  useEffect(() => {
    fetch(`http://localhost:4000/api/schedules/volunteer/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setSchedules(data));
  }, [user]);

  useEffect(() => {
    fetch('http://localhost:4000/api/ratings', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((ratings) => {
        const totals = {};
        ratings.forEach((r) => {
          const vid = r.volunteerId;
          if (!totals[vid]) totals[vid] = { sum: 0, count: 0 };
          totals[vid].sum += Number(r.rating);
          totals[vid].count += 1;
        });
        const avgs = {};
        Object.keys(totals).forEach(
          (vid) => (avgs[vid] = totals[vid].sum / totals[vid].count)
        );
        setAverages(avgs);
      });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:4000/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ parentId, startTime, endTime }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setSchedules((prev) => [
          ...prev,
          {
            id: data.id,
            volunteerId: user.id,
            parentId,
            startTime,
            endTime,
            status: 'pending',
          },
        ]);
        setParentId('');
        setStartTime('');
        setEndTime('');
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Volunteer Schedule
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create New Session
          </Typography>
          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <TextField
              label="Parent ID"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              fullWidth
            />
            <TextField
              label="Start Time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" type="submit">
              Add Session
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {schedules.map((session) => (
          <Grid item xs={12} sm={6} key={session.id}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle1">Parent: {session.parentId}</Typography>
                <Typography variant="body2">
                  {new Date(session.startTime).toLocaleString()} –{' '}
                  {new Date(session.endTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: <strong>{session.status}</strong>
                </Typography>
                <Typography variant="body2">
                  Avg Rating:{' '}
                  {averages[user.id] ? averages[user.id].toFixed(1) : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default SchedulePage;
