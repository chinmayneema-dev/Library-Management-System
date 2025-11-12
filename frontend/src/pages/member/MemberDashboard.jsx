import {
  Alert,
  Avatar,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { listBooks } from '../../api/books';
import { listBorrowRecords } from '../../api/borrow';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';
import PageHeader from '../../components/PageHeader.jsx';

const MemberDashboard = () => {
  const { user } = useAuth();

  const booksQuery = useQuery({
    queryKey: ['books', { page: 1, pageSize: 100 }],
    queryFn: () => listBooks({ page: 1, pageSize: 100 }),
  });

  const borrowQuery = useQuery({
    queryKey: ['borrowRecords', { memberId: user.memberId }],
    queryFn: () => listBorrowRecords({ memberId: user.memberId }),
  });

  if (booksQuery.isError || borrowQuery.isError) {
    return <Alert severity="error">Unable to load dashboard data.</Alert>;
  }

  const borrowed = borrowQuery.data?.filter((record) => record.status === 'ISSUED') ?? [];
  const pastBorrow = borrowQuery.data?.filter((record) => record.status === 'RETURNED') ?? [];
  const totalAvailable = booksQuery.data?.data?.filter((book) => book.status === 'AVAILABLE').length ?? 0;

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Welcome back"
        subtitle="Track your current loans, view past history, and explore the collection."
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.28), rgba(56,189,248,0.28))',
              color: '#0f172a',
              boxShadow: '0px 18px 40px rgba(79, 70, 229, 0.18)',
            }}
          >
            <Stack spacing={1.5}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.7)', color: '#312e81' }}>📚</Avatar>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 2, opacity: 0.75 }}>
                Active Borrowings
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {borrowed.length}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(59,130,246,0.28))',
              color: '#0f172a',
              boxShadow: '0px 18px 40px rgba(15, 23, 42, 0.14)',
            }}
          >
            <Stack spacing={1.5}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.7)', color: '#0f172a' }}>🕑</Avatar>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 2, opacity: 0.75 }}>
                Total Borrowed
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {borrowQuery.data?.length ?? 0}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(244,114,182,0.28), rgba(251,191,36,0.28))',
              color: '#0f172a',
              boxShadow: '0px 18px 40px rgba(244, 114, 182, 0.2)',
            }}
          >
            <Stack spacing={1.5}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.7)', color: '#be123c' }}>✨</Avatar>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 2, opacity: 0.75 }}>
                Available Books
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {totalAvailable}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Stack spacing={2}>
        <Typography variant="h6">Currently Borrowed</Typography>
        {borrowed.length === 0 ? (
          <Alert severity="info">You have no books issued right now.</Alert>
        ) : (
          borrowed.map((record) => (
            <Paper
              key={record.borrowId}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(148,163,184,0.18)',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {record.book?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due on {formatDate(record.dueDate)}
              </Typography>
            </Paper>
          ))
        )}
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Recent Returns</Typography>
        {pastBorrow.length === 0 ? (
          <Alert severity="info">You have not returned any books yet.</Alert>
        ) : (
          pastBorrow.slice(0, 3).map((record) => (
            <Paper
              key={record.borrowId}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(148,163,184,0.18)',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {record.book?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Returned on {formatDate(record.returnDate)}
              </Typography>
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default MemberDashboard;







