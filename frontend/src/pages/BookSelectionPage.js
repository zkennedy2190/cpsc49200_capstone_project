import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  Avatar,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
              <ListItemIcon>
                {book.coverUrl ? (
                  <Avatar
                    variant="square"
                    src={book.coverUrl}
                    alt={book.title}
                    sx={{ width: 48, height: 48, mr: 1 }}
                  />
                ) : (
                  <MenuBookIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={book.title} secondary={book.author} />
            </ListItem>
          </Tooltip>
        ))}
      </List>
      {selectedBook && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedBook.title}</DialogTitle>
          <DialogContent dividers>
            {selectedBook.coverUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  style={{ maxHeight: 250, objectFit: 'contain' }}
                />
              </Box>
            )}
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
