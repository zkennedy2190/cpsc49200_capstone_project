import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * Dashboard for volunteers.
 */
function VolunteerDashboard() {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/schedules/volunteer/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setSchedules);
    fetch('http://localhost:4000/api/ratings', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const total = data
          .filter((r) => r.volunteerId === user.id)
          .reduce((acc, r) => acc + Number(r.rating), 0);
        const count = data.filter((r) => r.volunteerId === user.id).length;
        setAvgRating(count ? (total / count).toFixed(1) : null);
      });
  }, [user]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Volunteer Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Upcoming Sessions</Typography>
              <Typography variant="h4">
                {schedules.filter((s) => s.status === 'approved').length}
              </Typography>
              <Button variant="contained" component={Link} to="/schedule">
                Manage Sessions
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Average Rating</Typography>
              <Typography variant="h4">{avgRating ?? 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Record a New Story</Typography>
              <Button variant="contained" component={Link} to="/recordings">
                Go to Recorder
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default VolunteerDashboard;
