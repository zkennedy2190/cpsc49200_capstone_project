import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * Enhanced dashboard for volunteers.
 * Shows upcoming approved sessions, average rating, and actions to propose a session or record a story.
 */
function VolunteerDashboard() {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    // Fetch schedules for this volunteer
    // Use a relative path so React's proxy forwards to the backend.
    fetch(`/api/schedules/volunteer/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort by start time ascending
          setSchedules(
            data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          );
        } else {
          setSchedules([]);
        }
      })
      .catch(() => setSchedules([]));

    // Fetch all ratings to compute volunteer's average rating
    // Use a relative path for ratings as well.
    fetch('/api/ratings', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const volunteerRatings = data.filter(
            (r) => Number(r.volunteerId) === Number(user.id)
          );
          if (volunteerRatings.length > 0) {
            const total = volunteerRatings.reduce(
              (acc, r) => acc + Number(r.rating),
              0
            );
            setAvgRating((total / volunteerRatings.length).toFixed(1));
          } else {
            setAvgRating(null);
          }
        } else {
          setAvgRating(null);
        }
      })
      .catch(() => setAvgRating(null));
  }, [user]);

  // Filter approved sessions
  const approvedSessions = schedules.filter((s) => s.status === 'approved');

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Volunteer Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Summary cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Upcoming Sessions</Typography>
              <Typography variant="h3">
                {approvedSessions.length}
              </Typography>
              <Button
                component={Link}
                to="/schedule"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Propose Session
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Rating</Typography>
              <Typography variant="h3">{avgRating ?? 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Record a New Story</Typography>
              <Button
                component={Link}
                to="/recordings"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Go to Recorder
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* List of upcoming approved sessions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upcoming Approved Sessions
        </Typography>
        {approvedSessions.length === 0 ? (
          <Typography>No approved sessions scheduled.</Typography>
        ) : (
          approvedSessions.map((session) => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Parent #{session.parentId}
                </Typography>
                <Typography variant="body2">
                  {new Date(session.startTime).toLocaleString()} –{' '}
                  {new Date(session.endTime).toLocaleString()}
                </Typography>
                <Typography variant="caption">
                  Status: {session.status}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}

export default VolunteerDashboard;