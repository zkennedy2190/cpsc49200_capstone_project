import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * Parent dashboard summarising upcoming sessions and available recordings.
 * Includes checks to ensure that non-array API responses (e.g. error messages) do not cause runtime errors.
 */
function ParentDashboard() {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [recordingsCount, setRecordingsCount] = useState(0);

  useEffect(() => {
    // Attempt to fetch all schedules (this will succeed only for admins).
    // If the response isn't an array, set schedules to an empty array.
    fetch('http://localhost:4000/api/schedules', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSchedules(data.filter((s) => Number(s.parentId) === user.id));
        } else {
          setSchedules([]);
        }
      })
      .catch(() => setSchedules([]));

    // Fetch recordings for this parent; handle non-array responses gracefully.
    fetch('http://localhost:4000/api/recordings', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecordingsCount(data.filter((r) => Number(r.parentId) === user.id).length);
        } else {
          setRecordingsCount(0);
        }
      })
      .catch(() => setRecordingsCount(0));
  }, [user]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parent Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Upcoming Sessions</Typography>
              <Typography variant="h4">{schedules.length}</Typography>
              <Button variant="contained" component={Link} to="/schedule">
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Available Recordings</Typography>
              <Typography variant="h4">{recordingsCount}</Typography>
              <Button variant="contained" component={Link} to="/recordings">
                Listen & Rate
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ParentDashboard;
