// frontend/src/pages/RecordingsLibraryPage.js
import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Rating,
  Alert,
} from '@mui/material';
import { AuthContext } from '../AuthContext';
import { apiFetch } from '../api';

/**
 * Displays uploaded recordings and allows parents to submit ratings/comments.
 * Uses apiFetch to target the correct backend URL.
 */
function RecordingsLibraryPage() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiFetch('/api/recordings', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error(err));
  }, [user]);

  const submitRating = async (file) => {
    await apiFetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        recording: file.id,
        rating: ratings[file.id],
        comment: comments[file.id],
        volunteerId: file.volunteerId,
      }),
    });
    setRatings({ ...ratings, [file.id]: '' });
    setComments({ ...comments, [file.id]: '' });
    setMessage('Rating submitted!');
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recordings Library
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recording #{file.id}
                </Typography>
                <Typography variant="subtitle2">
                  Volunteer #{file.volunteerId}
                </Typography>
                <Rating
                  value={ratings[file.id] || 0}
                  precision={0.5}
                  onChange={(_, newVal) =>
                    setRatings((prev) => ({ ...prev, [file.id]: newVal }))
                  }
                  sx={{ mt: 1 }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Comment"
                  value={comments[file.id] || ''}
                  onChange={(e) =>
                    setComments((prev) => ({
                      ...prev,
                      [file.id]: e.target.value,
                    }))
                  }
                  sx={{ mt: 1 }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => submitRating(file)}
                  >
                    Submit
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default RecordingsLibraryPage;
