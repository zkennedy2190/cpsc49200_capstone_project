import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const books = [
    { title: 'Goodnight Moon', author: 'Margaret Wise Brown' },
    { title: 'The Very Hungry Caterpillar', author: 'Eric Carle' },
    { title: 'Where the Wild Things Are', author: 'Maurice Sendak' },
];

function BookSelectionPage() {
    return (
        <Paper style={{ padding: 20 }}>
            <h2>Book Selection</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {books.map((book, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{book.title}</TableCell>
                            <TableCell>{book.author}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default BookSelectionPage;