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

const MemberSearchPage = () => {
  const [filters, setFilters] = useState({ title: '', author: '', category: '' });
  const searchMutation = useMutation({ mutationFn: searchBooks });

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
        title="Search the Collection"
        subtitle="Find new favourites by filtering across titles, authors, and categories."
      />
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: '1px solid rgba(148,163,184,0.16)',
          boxShadow: '0px 18px 40px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
          <TextField label="Title" name="title" value={filters.title} onChange={handleChange} fullWidth />
          <TextField label="Author" name="author" value={filters.author} onChange={handleChange} fullWidth />
          <TextField label="Category" name="category" value={filters.category} onChange={handleChange} fullWidth />
          <Box display="flex" alignItems="center">
            <Button type="submit" startIcon={<Search />} disabled={searchMutation.isLoading} sx={{ minWidth: 150 }}>
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
            boxShadow: '0px 18px 40px rgba(15, 23, 42, 0.12)',
          }}
        >
          <Table stickyHeader>
            <TableHead
              sx={{
                background: 'linear-gradient(135deg, rgba(129,140,248,0.18), rgba(14,165,233,0.18))',
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((book) => (
                <TableRow key={book.bookId}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category || '—'}</TableCell>
                  <TableCell>{formatStatus(book.status)}</TableCell>
                </TableRow>
              ))}
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No books found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Search to find available books.
        </Typography>
      )}
    </Stack>
  );
};

export default MemberSearchPage;







