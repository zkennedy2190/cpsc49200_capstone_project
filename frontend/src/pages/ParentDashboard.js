import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * Parent dashboard summarising upcoming sessions and available recordings.
 * Includes a child selector when multiple children are present.
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
      .then((data) => setSchedules(Array.isArray(data) ? data : []));

    // Fetch recordings for this parent
    fetch(`http://localhost:4000/api/recordings/parent/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecordings(Array.isArray(data) ? data : []));

    // Fetch unique child IDs
    fetch(`http://localhost:4000/api/children/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChildrenIds(data);
          if (data.length > 0) {
            setSelectedChild(data[0]);
          }
        }
      });
  }, [user]);

  // Filter recordings by child (if a specific child is selected)
  const filteredRecordings =
    selectedChild === 'all'
      ? recordings
      : recordings.filter((r) => r.childId === Number(selectedChild));

  const approvedSchedules = schedules.filter((s) => s.status === 'approved');

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parent Dashboard
      </Typography>

      {/* Child selector */}
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
        {/* Sessions summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Upcoming Sessions</Typography>
              <Typography variant="h3">{approvedSchedules.length}</Typography>
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
        {/* Recordings summary */}
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
                Listen &amp; Rate
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming sessions list */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upcoming Approved Sessions
        </Typography>
        {approvedSchedules.length === 0 ? (
          <Typography>No approved sessions scheduled.</Typography>
        ) : (
          approvedSchedules.map((session) => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
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
