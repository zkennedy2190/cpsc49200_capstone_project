// frontend/src/pages/BookSelectionPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { apiFetch } from '../api';

/**
 * BookSelectionPage
 *
 * Fetches children’s books from the back‑end and displays them in a list.
 * Shows title and author; clicking opens a synopsis dialog.  Uses the apiFetch
 * helper so the API base URL comes from environment or defaults to localhost.
 */
function BookSelectionPage() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    apiFetch('/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setBooks([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
        setBooks([]);
      });
  }, []);

  const handleOpen = (book) => {
    setSelectedBook(book);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBook(null);
  };

  const getSynopsisPreview = (synopsis) => {
    if (!synopsis) return 'No synopsis available';
    const trimmed = synopsis.trim();
    return trimmed.length > 100 ? `${trimmed.slice(0, 100)}…` : trimmed;
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Selection
      </Typography>
      <List>
        {books.map((book) => (
          <ListItem
            button
            key={book.id}
            onClick={() => handleOpen(book)}
            sx={{ mb: 1 }}
          >
            <Tooltip title={getSynopsisPreview(book.synopsis)} placement="right">
              <ListItemText
                primary={book.title}
                secondary={book.author}
              />
            </Tooltip>
          </ListItem>
        ))}
      </List>
      {selectedBook && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedBook.title}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              {selectedBook.author}
            </Typography>
            <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
              {selectedBook.synopsis || 'No synopsis available.'}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
}

export default BookSelectionPage;
