import React, { useEffect, useState, useContext } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { AuthContext } from '../AuthContext';

function SchedulePage() {
  const { token, userId } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [parentId, setParentId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSchedules() {
      const res = await fetch(
        `http://localhost:4000/api/schedules/volunteer/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSchedules(data);
    }
    if (userId) {
      fetchSchedules();
    }
  }, [userId, token]);

  useEffect(() => {
    async function fetchAverages() {
      const res = await fetch('http://localhost:4000/api/ratings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ratings = await res.json();
      const totals = {};
      ratings.forEach((r) => {
        const vid = r.volunteerId;
        if (!totals[vid]) {
          totals[vid] = { sum: 0, count: 0 };
        }
        totals[vid].sum += Number(r.rating);
        totals[vid].count += 1;
      });
      const averages = {};
      Object.keys(totals).forEach(
        (vid) => (averages[vid] = totals[vid].sum / totals[vid].count)
      );
      setVolunteerAverages(averages);
    }
    fetchAverages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        volunteerId: userId,
        parentId,
        dateTime,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Schedule created');
      setSchedules((prev) => [
        ...prev,
        { id: data.id, volunteerId: userId, parentId, dateTime },
      ]);
      setParentId('');
      setDateTime('');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <Paper style={{ padding: 20 }}>
      <h2>Volunteer Schedule</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Parent ID"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date and Time"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Session
        </Button>
      </form>

      {message && <p>{message}</p>}

      <Table sx={{ marginTop: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Parent ID</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Average Rating</TableCell> {/* new column header */}
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.parentId}</TableCell>
              <TableCell>{session.dateTime}</TableCell>
              {/* new cell to display the average rating for this volunteer */}
              <TableCell>
                {volunteerAverages[session.volunteerId]
                  ? volunteerAverages[session.volunteerId].toFixed(1)
                  : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SchedulePage;