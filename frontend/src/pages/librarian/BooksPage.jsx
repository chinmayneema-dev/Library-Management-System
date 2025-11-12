import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Add, Delete, Edit, Refresh } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBook, deleteBook, listBooks, updateBook } from '../../api/books';
import { formatStatus } from '../../utils/format';
import PageHeader from '../../components/PageHeader.jsx';

const initialFormState = {
  title: '',
  author: '',
  category: '',
  publisher: '',
  isbn: '',
  status: 'AVAILABLE',
};

const BooksPage = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const booksQuery = useQuery({
    queryKey: ['books', { page: 1, pageSize: 100 }],
    queryFn: () => listBooks({ page: 1, pageSize: 100 }),
  });

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ bookId, values }) => updateBook(bookId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const isSubmitting = addMutation.isLoading || updateMutation.isLoading;

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormState(initialFormState);
    setDialogOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingId(book.bookId);
    setFormState({
      title: book.title,
      author: book.author,
      category: book.category ?? '',
      publisher: book.publisher ?? '',
      isbn: book.isbn,
      status: book.status,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormState(initialFormState);
    setEditingId(null);
    addMutation.reset();
    updateMutation.reset();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingId) {
      updateMutation.mutate({ bookId: editingId, values: formState });
    } else {
      addMutation.mutate(formState);
    }
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Delete this book?')) {
      deleteMutation.mutate(bookId);
    }
  };

  const books = useMemo(() => booksQuery.data?.data ?? [], [booksQuery.data]);

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Manage Collection"
        subtitle="Add new titles, edit existing records, and stay in control of your catalogue."
        action={(
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => queryClient.invalidateQueries({ queryKey: ['books'] })}
              sx={{ borderRadius: 999 }}
            >
              Refresh
            </Button>
            <Button startIcon={<Add />} onClick={handleOpenCreate}>
              Add Book
            </Button>
          </Stack>
        )}
      />

      {booksQuery.isError ? <Alert severity="error">Unable to load books.</Alert> : null}

      <TableContainer
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(148,163,184,0.18)',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.18))',
                '& th': {
                  color: '#0f172a',
                  fontWeight: 600,
                  borderBottom: 'none',
                },
              }}
            >
              <TableCell sx={{ width: '20%' }}>Title</TableCell>
              <TableCell sx={{ width: '16%' }}>Author</TableCell>
              <TableCell sx={{ width: '14%' }}>Category</TableCell>
              <TableCell sx={{ width: '16%' }}>Publisher</TableCell>
              <TableCell sx={{ width: '14%' }}>ISBN</TableCell>
              <TableCell sx={{ width: '10%' }}>Status</TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow
                key={book.bookId}
                hover
                sx={{
                  '& td': { borderBottomColor: 'rgba(148,163,184,0.15)' },
                }}
              >
                <TableCell>
                  <Stack spacing={0.5}>
                    <Box sx={{ fontWeight: 600 }}>{book.title}</Box>
                    <Box sx={{ color: 'text.secondary', fontSize: 13 }}>{book.publisher || '—'}</Box>
                  </Stack>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category || '—'}</TableCell>
                <TableCell>{book.publisher || '—'}</TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>{book.isbn}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 999,
                      bgcolor: book.status === 'AVAILABLE' ? 'rgba(16,185,129,0.12)' : 'rgba(251,191,36,0.18)',
                      color: book.status === 'AVAILABLE' ? '#047857' : '#92400e',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {formatStatus(book.status)}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEdit(book)}
                    sx={{
                      mr: 1,
                      bgcolor: 'rgba(99,102,241,0.08)',
                      '&:hover': { bgcolor: 'rgba(99,102,241,0.15)' },
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(book.bookId)}
                    sx={{
                      bgcolor: 'rgba(239,68,68,0.08)',
                      '&:hover': { bgcolor: 'rgba(239,68,68,0.16)' },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {books.length === 0 && !booksQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No books found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} component="form" onSubmit={handleSubmit} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" name="title" value={formState.title} onChange={handleChange} required fullWidth />
            <TextField label="Author" name="author" value={formState.author} onChange={handleChange} required fullWidth />
            <TextField label="Category" name="category" value={formState.category} onChange={handleChange} fullWidth />
            <TextField label="Publisher" name="publisher" value={formState.publisher} onChange={handleChange} fullWidth />
            <TextField label="ISBN" name="isbn" value={formState.isbn} onChange={handleChange} required fullWidth />
            <TextField select label="Status" name="status" value={formState.status} onChange={handleChange} fullWidth>
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="ISSUED">Issued</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default BooksPage;







