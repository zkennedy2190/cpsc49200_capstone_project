import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

/**
 * About Us page introducing StoryBridge and its mission.
 */
function AboutUsPage() {
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
          <Typography variant="h4" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            StoryBridge is an initiative inspired by Aunt Mary’s Storybook program.  Our mission is to
            connect volunteers with children and families for interactive reading sessions,
            fostering a love of stories and promoting early literacy regardless of geographic or
            economic barriers.
          </Typography>
          <Typography variant="body1" paragraph>
            By providing a platform for scheduling, recording and sharing read‑aloud sessions,
            we help volunteers, parents and guardians build meaningful connections through the
            power of storytelling.  Thank you for being a part of our community!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AboutUsPage;
