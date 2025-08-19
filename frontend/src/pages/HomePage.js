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
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to StoryBridge
          </Typography>
          {/* Centre the tagline on its own line */}
          <Typography variant="subtitle1" gutterBottom>
            Aunt Mary’s Storybook portal
          </Typography>
          {/* Remove the extra descriptive line here */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
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
