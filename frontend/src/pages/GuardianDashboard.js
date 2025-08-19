import React from 'react';
import { Container, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function GuardianDashboard() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Guardian Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Manage Children</Typography>
              <Button variant="contained" component={Link} to="/recordings">
                View Recordings
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6">Upcoming Sessions</Typography>
              <Button variant="contained" component={Link} to="/schedule">
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
export default GuardianDashboard;
