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

/**
 * BookSelectionPage (synopsis only)
 *
 * This component fetches a list of children’s books from the back‑end and displays
 * them in a list. Each item shows the book title and author. On hover, a
 * tooltip shows a truncated synopsis; clicking an item opens a dialog with
 * the full synopsis. Cover images are deliberately excluded to simplify the
 * page and because no `coverUrl` field is present in the data.
 */
function BookSelectionPage() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/books')
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
          <Tooltip
            key={book.id}
            title={getSynopsisPreview(book.synopsis)}
            arrow
            placement="right"
          >
            <ListItem button onClick={() => handleOpen(book)}>
              <ListItemText primary={book.title} secondary={book.author} />
            </ListItem>
          </Tooltip>
        ))}
      </List>
      {selectedBook && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedBook.title}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle1" gutterBottom>
              {selectedBook.author}
            </Typography>
            <DialogContentText>
              {selectedBook.synopsis || 'No synopsis available.'}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
}

export default BookSelectionPage;
