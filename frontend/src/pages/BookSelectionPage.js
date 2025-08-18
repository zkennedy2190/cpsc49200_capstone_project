import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const books = [
    { title: 'Goodnight Moon', author: 'Margaret Wise Brown' },
    { title: 'The Very Hungry Caterpillar', author: 'Eric Carle' },
    { title: 'Where the Wild Things Are', author: 'Maurice Sendak' },
];

function BookSelectionPage() {
    return (
        <div>
            <h2>Book Selection</h2>
            <ul>
                {books.map((book) => (
                    <li key={book.title}>
                        <strong>{book.title}</strong> by {book.author}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookSelectionPage;