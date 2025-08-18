import React, { useEffect, useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AuthContext } from '../AuthContext';

function SchedulePage() {
  const { token, userId } = useContext(AuthContext); // ensure userId is stored in AuthContext
  const [schedules, setSchedules] = useState([]);
  const [parentId, setParentId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState('');

  // Fetch the volunteer’s schedule on component mount
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

  // Handle form submission to add a new schedule entry
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
      // Refresh the list
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
            <TableCell>Date &amp; Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.parentId}</TableCell>
              <TableCell>{session.dateTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SchedulePage;