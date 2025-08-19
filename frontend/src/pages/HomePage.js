import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card
        elevation={3}
        sx={{
          background: 'linear-gradient(to bottom, #f3c13a, #d6a90b 60%, #b8860b)',
          color: 'black',
        }}
      >
        <CardContent>
          {/* Updated heading */}
          <Typography variant="h4" gutterBottom>
            Welcome to StoryBridge!
          </Typography>
          {/* Tagline referring back to Aunt Mary’s Storybook */}
          <Typography variant="subtitle1" gutterBottom>
            Aunt Mary’s Storybook Portal
          </Typography>
          <Typography variant="body1" gutterBottom>
            Connecting volunteers with children and families for interactive reading sessions.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" component={Link} to="/login">
              Login
            </Button>
            <Button variant="contained" component={Link} to="/register">
              Register
            </Button>
            <Button variant="contained" component={Link} to="/recordings">
              Recordings
            </Button>
            <Button variant="contained" component={Link} to="/schedule">
              Schedule
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
export default HomePage;
