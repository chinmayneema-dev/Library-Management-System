import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { searchBooks } from '../../api/books';
import { formatStatus } from '../../utils/format';
import PageHeader from '../../components/PageHeader.jsx';

const SearchPage = () => {
  const [filters, setFilters] = useState({ title: '', author: '', category: '' });

  const searchMutation = useMutation({
    mutationFn: searchBooks,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchMutation.mutate(filters);
  };

  const results = searchMutation.data ?? [];

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Search Library"
        subtitle="Filter across title, author, or category. Discover books instantly."
      />
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: '1px solid rgba(148,163,184,0.16)',
          boxShadow: '0px 18px 42px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
          <TextField label="Title" name="title" value={filters.title} onChange={handleChange} fullWidth />
          <TextField label="Author" name="author" value={filters.author} onChange={handleChange} fullWidth />
          <TextField label="Category" name="category" value={filters.category} onChange={handleChange} fullWidth />
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button
              type="submit"
              startIcon={<Search />}
              disabled={searchMutation.isLoading}
              sx={{ minWidth: 160 }}
            >
              {searchMutation.isLoading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {searchMutation.isError ? <Alert severity="error">Search failed.</Alert> : null}

      {searchMutation.isSuccess ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(148,163,184,0.16)',
            boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.12)',
          }}
        >
          <Table stickyHeader>
            <TableHead
              sx={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(14,165,233,0.18))',
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Publisher</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((book) => (
                <TableRow key={book.bookId}>
                  <TableCell>
                    <Stack spacing={0.4}>
                      <Typography fontWeight={600}>{book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.publisher || '—'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category || '—'}</TableCell>
                  <TableCell>{book.publisher || '—'}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 999,
                        bgcolor: book.status === 'AVAILABLE' ? 'rgba(16,185,129,0.12)' : 'rgba(251,191,36,0.18)',
                        color: book.status === 'AVAILABLE' ? '#047857' : '#92400e',
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {formatStatus(book.status)}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No books found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Enter search criteria to find books.
        </Typography>
      )}
    </Stack>
  );
};

export default SearchPage;







