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

/**
 * Library of recordings with rating and comment functionality.
 */
function RecordingsLibraryPage() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/recordings', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error(err));
  }, [user]);

  const submitRating = async (file) => {
    await fetch('http://localhost:4000/api/ratings', {
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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recordings Library
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      <Grid container spacing={3}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6">Recording #{file.id}</Typography>
                <audio
                  controls
                  src={`http://localhost:4000/${file.filePath}`}
                  style={{ width: '100%', marginTop: 8 }}
                />
                <Stack spacing={1} mt={2}>
                  <Rating
                    name={`rating-${file.id}`}
                    value={Number(ratings[file.id] || 0)}
                    onChange={(e, newVal) =>
                      setRatings((prev) => ({ ...prev, [file.id]: newVal }))
                    }
                  />
                    <TextField
                      label="Comment"
                      size="small"
                      value={comments[file.id] || ''}
                      onChange={(e) =>
                        setComments((prev) => ({ ...prev, [file.id]: e.target.value }))
                      }
                    />
                  <Button variant="contained" onClick={() => submitRating(file)}>
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
