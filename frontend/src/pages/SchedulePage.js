import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

function SchedulePage() {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [parentId, setParentId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [averages, setAverages] = useState({});

  // Fetch schedules for this volunteer
  useEffect(() => {
    fetch(`http://localhost:4000/api/schedules/volunteer/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setSchedules(data));
  }, [user]);

  // Fetch ratings to compute volunteer averages
  useEffect(() => {
    fetch('http://localhost:4000/api/ratings', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((ratings) => {
        const totals = {};
        ratings.forEach((r) => {
          const vid = r.volunteerId;
          if (!totals[vid]) totals[vid] = { sum: 0, count: 0 };
          totals[vid].sum += Number(r.rating);
          totals[vid].count += 1;
        });
        const avgs = {};
        Object.keys(totals).forEach(
          (vid) => (avgs[vid] = totals[vid].sum / totals[vid].count)
        );
        setAverages(avgs);
      });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:4000/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ parentId, startTime, endTime }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setSchedules((prev) => [
          ...prev,
          {
            id: data.id,
            volunteerId: user.id,
            parentId,
            startTime,
            endTime,
            status: 'pending',
          },
        ]);
        setParentId('');
        setStartTime('');
        setEndTime('');
      });
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
          label="Start Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="End Time"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Session
        </Button>
      </form>
      {message && <p>{message}</p>}
      <Table style={{ marginTop: 16 }}>
        <TableHead>
          <TableRow>
            <TableCell>Parent ID</TableCell>
            <TableCell>Start – End</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Avg Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.parentId}</TableCell>
              <TableCell>{session.startTime} – {session.endTime}</TableCell>
              <TableCell>{session.status}</TableCell>
              <TableCell>
                {averages[user.id] ? averages[user.id].toFixed(1) : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SchedulePage;