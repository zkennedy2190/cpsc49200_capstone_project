import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Link,
} from '@mui/material';

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
          <Typography variant="h4" gutterBottom align="center">
            About StoryBridge
          </Typography>
          {/* Mission statement with increased font size and line height */}
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
          >
            StoryBridge is an extension of the Aunt Mary’s Storybook Project, a program that
            records incarcerated parents and grandparents as they read books aloud
            to their children.  The recording and the book are then sent to the
            child, allowing families to stay connected through the power of
            storytelling.  The heartfelt messages and familiar voices help bridge
            the physical separation, fostering emotional bonds that might
            otherwise be impossible.
          </Typography>
          {/* History and expansion with enhanced typography */}
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
          >
            The project began in 1993 as a simple holiday initiative at a single
            facility, launched by Companions Journeying Together.  Over the past
            decades it has expanded to fourteen correctional facilities across
            Illinois and has become a model replicated in more than twenty states.
            Volunteers visit facilities to help participants choose books, record
            their readings and include personal messages.  Thanks to the dedication
            of volunteers and donors, thousands of children have received these
            treasured recordings and books.
          </Typography>
          {/* Commitment to improvement and impact with larger text */}
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
          >
            Aunt Mary’s Storybook continually seeks to improve its operations.  After
            each recording session, incarcerated parents complete a survey to
            provide feedback, ensuring the program continues to meet their needs.
            By delivering the gift of story, the project nurtures literacy,
            strengthens family bonds and offers comfort to children during
            difficult times.
          </Typography>
          {/* External link with larger font size and emphasis */}
          <Typography
            variant="body2"
            align="center"
            sx={{ fontSize: '1.1rem' }}
          >
            Learn more at&nbsp;
            <Link
              href="https://cjtinc.org/projects/amsb/"
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              sx={{ fontWeight: 600, color: 'blue' }}
            >
              Aunt Mary’s Storybook Project
            </Link>
            .
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AboutUsPage;
