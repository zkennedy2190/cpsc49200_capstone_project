import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

function RecordingsLibraryPage() {
    const { user } = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        fetch('http://localhost:4000/api/recordings', {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then((res) => res.json())
            .then((data) => setFiles(data))
            .catch((err) => console.error(err));
    }, [user]);

    const submitRating = async (fileId) => {
        const rating = ratings[fileId];
        const comment = comments[fileId];
        await fetch('http://localhost:4000/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                recording: fileId,
                rating,
                comment,
                volunteerId: files.find((f) => f.id === fileId)?.volunteerId,
            }),
        });
        setRatings((prev) => ({ ...prev, [fileId]: '' }));
        setComments((prev) => ({ ...prev, [fileId]: '' }));
        alert('Rating submitted');
    };

    return (
        <Paper style={{ padding: 20 }}>
            <h2>Recordings Library</h2>
            {files.length === 0 && <p>No recordings available.</p>}
            {files.length > 0 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Playback</TableCell>
                            <TableCell>Rating (1–5)</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell>{file.id}</TableCell>
                                <TableCell>
                                    <audio src={`/${file.filePath}`} controls />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        size="small"
                                        inputProps={{ min: 1, max: 5 }}
                                        value={ratings[file.id] || ''}
                                        onChange={(e) =>
                                            setRatings((prev) => ({ ...prev, [file.id]: e.target.value }))
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        value={comments[file.id] || ''}
                                        onChange={(e) =>
                                            setComments((prev) => ({ ...prev, [file.id]: e.target.value }))
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => submitRating(file.id)}
                                    >
                                        Submit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
}

export default RecordingsLibraryPage;