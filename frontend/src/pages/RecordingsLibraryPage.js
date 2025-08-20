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

function RecordingsLibraryPage() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const base =
    (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');

  // Resolve a playable URL and timestamp from a variety of backend shapes
  const resolveAudioUrl = (r) => {
    const direct =
      r.url || r.audioUrl || r.fileUrl ||
      (r.path
        ? (r.path.startsWith('http') ? r.path : `${base}${r.path.startsWith('/') ? '' : '/'}${r.path}`)
        : null);

    if (direct) return direct;
    if (r.filename) return `${base}/uploads/${r.filename}`;
    return null;
  };

  const resolveCreatedAt = (r) =>
    r.createdAt || r.uploadedAt || r.date || r.timestamp || null;

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/recordings', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = typeof res?.json === 'function' ? await res.json() : res;
        const normalized = (Array.isArray(data) ? data : []).map((r) => ({
          ...r,
          audioUrl: resolveAudioUrl(r),
          createdAt: resolveCreatedAt(r),
        }));
        setFiles(normalized);
        setError('');
      } catch (err) {
        console.error(err);
        setFiles([]);
        setError('Failed to load recordings.');
      }
    })();
  }, [user, base]);

  const submitRating = async (file) => {
    try {
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
      setTimeout(() => setMessage(''), 2500);
    } catch (e) {
      console.error(e);
      setError('Failed to submit rating.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recordings Library
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {files.map((file) => {
          const audioUrl = file.audioUrl;
          const ts = file.createdAt
            ? new Date(file.createdAt).toLocaleString()
            : '—';

          return (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {file.title || `Recording #${file.id}`}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Volunteer #{file.volunteerId ?? '—'}
                  </Typography>

                  {/* NEW: audio player */}
                  {audioUrl ? (
                    <audio
                      controls
                      preload="metadata"
                      src={audioUrl}
                      style={{ width: '100%', marginBottom: 8 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Audio not available
                    </Typography>
                  )}

                  {/* NEW: timestamp */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Recorded: {ts}
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
                    <Button variant="contained" onClick={() => submitRating(file)}>
                      Submit
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default RecordingsLibraryPage;
