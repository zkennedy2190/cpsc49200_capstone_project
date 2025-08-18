import React from 'react';

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