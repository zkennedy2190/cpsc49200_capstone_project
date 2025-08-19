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

/**
 * Landing page with a glossy gold card, centred heading and tagline.
 * Includes Login, Register and About Us buttons only.
 */
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
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ textDecoration: 'underline' }}
          >
            Aunt Mary’s Storybook Portal
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            sx={{ fontStyle: 'italic' }}
          >
            Connecting volunteers with children and families for interactive reading sessions
          </Typography>
          {/* Remove Recordings and Schedule; add About Us */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button variant="contained" component={Link} to="/login">
              Login
            </Button>
            <Button variant="contained" component={Link} to="/register">
              Register
            </Button>
            <Button variant="contained" component={Link} to="/about">
              About Us
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default HomePage;
