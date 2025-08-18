import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import AudioRecorder from '../components/AudioRecorder';

function VolunteerDashboard() {
  return (
    <div>
      <h2>Volunteer Dashboard</h2>
      <AudioRecorder />
    </div>
  );
}

export default VolunteerDashboard;
