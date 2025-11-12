import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
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
  Divider,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { issueBook, listBorrowRecords, returnBook } from '../../api/borrow';
import { listBooks } from '../../api/books';
import { listMembers } from '../../api/members';
import { formatDate } from '../../utils/format';
import PageHeader from '../../components/PageHeader.jsx';

const BorrowPage = () => {
  const queryClient = useQueryClient();
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    memberId: '',
    dueDate: dayjs().add(14, 'day').format('YYYY-MM-DD'),
  });

  const booksQuery = useQuery({
    queryKey: ['books', { page: 1, pageSize: 200 }],
    queryFn: () => listBooks({ page: 1, pageSize: 200 }),
  });

  const membersQuery = useQuery({
    queryKey: ['members', { page: 1, pageSize: 200 }],
    queryFn: () => listMembers({ page: 1, pageSize: 200 }),
  });

  const borrowQuery = useQuery({
    queryKey: ['borrowRecords', { status: 'ISSUED' }],
    queryFn: () => listBorrowRecords({ status: 'ISSUED' }),
  });

  const issueMutation = useMutation({
    mutationFn: issueBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowRecords'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIssueForm((prev) => ({ ...prev, bookId: '', memberId: '' }));
    },
  });

  const returnMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowRecords'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const availableBooks = useMemo(
    () => (booksQuery.data?.data ?? []).filter((book) => book.status === 'AVAILABLE'),
    [booksQuery.data],
  );

  const members = useMemo(() => membersQuery.data?.data ?? [], [membersQuery.data]);
  const borrowRecords = useMemo(() => borrowQuery.data ?? [], [borrowQuery.data]);

  const handleIssueChange = (event) => {
    const { name, value } = event.target;
    setIssueForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIssueSubmit = (event) => {
    event.preventDefault();
    issueMutation.mutate({
      bookId: Number(issueForm.bookId),
      memberId: Number(issueForm.memberId),
      dueDate: issueForm.dueDate,
    });
  };

  const handleReturn = (borrowId) => {
    returnMutation.mutate({ borrowId, returnDate: dayjs().format('YYYY-MM-DD') });
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Issue & Return"
        subtitle="Handle lending transactions swiftly and keep the catalogue status accurate."
      />

      {(booksQuery.isError || membersQuery.isError || borrowQuery.isError) ? (
        <Alert severity="error">Unable to load borrow data.</Alert>
      ) : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            component="form"
            onSubmit={handleIssueSubmit}
            sx={{
              p: 3.5,
              borderRadius: 4,
              boxShadow: '0px 20px 45px rgba(79, 70, 229, 0.12)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(241,245,249,0.95))',
              border: '1px solid rgba(148,163,184,0.16)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Issue Book
            </Typography>
            <Stack spacing={2}>
              <TextField
                select
                label="Book"
                name="bookId"
                value={issueForm.bookId}
                onChange={handleIssueChange}
                required
                fullWidth
              >
                {availableBooks.map((book) => (
                  <MenuItem key={book.bookId} value={book.bookId}>
                    {book.title} — {book.author}
                  </MenuItem>
                ))}
                {availableBooks.length === 0 ? <MenuItem disabled value="">No available books</MenuItem> : null}
              </TextField>

              <TextField
                select
                label="Member"
                name="memberId"
                value={issueForm.memberId}
                onChange={handleIssueChange}
                required
                fullWidth
              >
                {members.map((member) => (
                  <MenuItem key={member.memberId} value={member.memberId}>
                    {member.name} ({member.email})
                  </MenuItem>
                ))}
                {members.length === 0 ? <MenuItem disabled value="">No members found</MenuItem> : null}
              </TextField>

              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={issueForm.dueDate}
                onChange={handleIssueChange}
                InputLabelProps={{ shrink: true }}
                required
              />

              <Button type="submit" disabled={issueMutation.isLoading}>
                {issueMutation.isLoading ? 'Issuing...' : 'Issue Book'}
              </Button>
              {issueMutation.isError ? (
                <Alert severity="error">
                  {issueMutation.error.response?.data?.message || 'Failed to issue book'}
                </Alert>
              ) : null}
              {issueMutation.isSuccess ? <Alert severity="success">Book issued successfully.</Alert> : null}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3.5,
              borderRadius: 4,
              boxShadow: '0px 16px 38px rgba(15, 23, 42, 0.12)',
              border: '1px solid rgba(148,163,184,0.16)',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">
              Active Borrowings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {borrowRecords.length} active
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2, borderColor: 'rgba(148,163,184,0.2)' }} />
            <TableContainer
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(148,163,184,0.12)',
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(14,165,233,0.18))',
                      '& th': { fontWeight: 600, borderBottom: 'none' },
                    }}
                  >
                    <TableCell>Book</TableCell>
                    <TableCell>Member</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrowRecords.map((record) => (
                    <TableRow
                      key={record.borrowId}
                      sx={{
                        '& td': { borderBottomColor: 'rgba(148,163,184,0.15)' },
                      }}
                    >
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Box sx={{ fontWeight: 600 }}>{record.book?.title}</Box>
                          <Box sx={{ fontSize: 12, color: 'text.secondary' }}>
                            {record.book?.author}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{record.member?.name}</TableCell>
                      <TableCell>{formatDate(record.issueDate)}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 0.4,
                            borderRadius: 999,
                            bgcolor: 'rgba(251,191,36,0.18)',
                            color: '#92400e',
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          {formatDate(record.dueDate)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleReturn(record.borrowId)}
                          disabled={returnMutation.isLoading}
                        >
                          Mark Returned
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {borrowRecords.length === 0 && !borrowQuery.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No active borrow records.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
            {returnMutation.isError ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                {returnMutation.error.response?.data?.message || 'Failed to update return'}
              </Alert>
            ) : null}
            {returnMutation.isSuccess ? <Alert severity="success" sx={{ mt: 2 }}>Book returned successfully.</Alert> : null}
            {borrowRecords.length === 0 && !borrowQuery.isLoading ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No active borrow records at the moment.
              </Alert>
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default BorrowPage;







