import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * Enhanced parent dashboard.
 * Displays counts for upcoming sessions and recordings, supports child selection,
 * and lists upcoming approved sessions. Uses parent-specific API endpoints.
 */
function ParentDashboard() {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [childrenIds, setChildrenIds] = useState([]);
  const [selectedChild, setSelectedChild] = useState('all');

  useEffect(() => {
    // Fetch schedules for this parent
    fetch(`http://localhost:4000/api/schedules/parent/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSchedules(data);
        } else {
          setSchedules([]);
        }
      })
      .catch(() => setSchedules([]));

    // Fetch recordings for this parent
    fetch(`http://localhost:4000/api/recordings/parent/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecordings(data);
        } else {
          setRecordings([]);
        }
      })
      .catch(() => setRecordings([]));

    // Fetch unique child IDs
    fetch(`http://localhost:4000/api/children/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChildrenIds(data);
          if (data.length === 1) {
            setSelectedChild(data[0]);
          } else {
            setSelectedChild('all');
          }
        } else {
          setChildrenIds([]);
          setSelectedChild('all');
        }
      })
      .catch(() => {
        setChildrenIds([]);
        setSelectedChild('all');
      });
  }, [user]);

  const approvedSchedules = schedules.filter((s) => s.status === 'approved');
  const filteredSchedules =
    selectedChild === 'all'
      ? approvedSchedules
      : approvedSchedules.filter(
          (s) => Number(s.childId) === Number(selectedChild)
        );
  const filteredRecordings =
    selectedChild === 'all'
      ? recordings
      : recordings.filter(
          (r) => Number(r.childId) === Number(selectedChild)
        );

  const handleChildChange = (event) => {
    setSelectedChild(event.target.value);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parent Dashboard
      </Typography>
      {childrenIds.length > 1 && (
        <FormControl sx={{ mb: 3, minWidth: 200 }}>
          <InputLabel id="child-select-label">Select Child</InputLabel>
          <Select
            labelId="child-select-label"
            value={selectedChild}
            label="Select Child"
            onChange={handleChildChange}
          >
            <MenuItem value="all">All Children</MenuItem>
            {childrenIds.map((childId) => (
              <MenuItem key={childId} value={childId}>
                Child #{childId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Upcoming Sessions</Typography>
              <Typography variant="h3">{filteredSchedules.length}</Typography>
              <Button
                component={Link}
                to="/schedule"
                variant="contained"
                sx={{ mt: 2 }}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Available Recordings</Typography>
              <Typography variant="h3">{filteredRecordings.length}</Typography>
              <Button
                component={Link}
                to={
                  selectedChild === 'all'
                    ? '/recordings-library'
                    : `/recordings-library?childId=${selectedChild}`
                }
                variant="contained"
                sx={{ mt: 2 }}
              >
                Listen & Rate
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upcoming Approved Sessions
        </Typography>
        {filteredSchedules.length === 0 ? (
          <Typography>No approved sessions scheduled.</Typography>
        ) : (
          filteredSchedules.map((session) => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Volunteer #{session.volunteerId}
                </Typography>
                <Typography variant="body2">
                  {new Date(session.startTime).toLocaleString()} –{' '}
                  {new Date(session.endTime).toLocaleString()}
                </Typography>
                <Typography variant="caption">
                  Status: {session.status}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}

export default ParentDashboard;