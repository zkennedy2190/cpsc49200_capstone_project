import React from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';

// Hard‑coded book list; in a real application this could be fetched from an API.
const books = [
  { title: 'Goodnight Moon', author: 'Margaret Wise Brown' },
  { title: 'The Very Hungry Caterpillar', author: 'Eric Carle' },
  { title: 'Where the Wild Things Are', author: 'Maurice Sendak' },
];

/**
 * Displays available books in a responsive grid of cards rather than a plain table.
 */
function BookSelectionPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Selection
      </Typography>
      <Grid container spacing={2}>
        {books.map((book, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
export default BookSelectionPage;
