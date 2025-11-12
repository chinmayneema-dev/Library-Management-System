import PropTypes from 'prop-types';
import {
  Alert,
  Avatar,
  Box,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LibraryBooks, Group, AssignmentTurnedIn } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { listBooks } from '../../api/books';
import { listMembers } from '../../api/members';
import { listBorrowRecords } from '../../api/borrow';
import PageHeader from '../../components/PageHeader.jsx';

const StatCard = ({ title, value, subtitle, icon, gradient }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: 4,
      background: gradient,
      color: '#0f172a',
      boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.12)',
      height: '100%',
    }}
  >
    <Stack spacing={2}>
      <Avatar
        sx={{
          bgcolor: 'rgba(255,255,255,0.7)',
          color: '#1f2937',
          width: 52,
          height: 52,
          boxShadow: '0px 10px 25px rgba(15,23,42,0.18)',
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ textTransform: 'uppercase', letterSpacing: 2, opacity: 0.75 }}
        >
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
          {value}
        </Typography>
      </Box>
      {subtitle ? (
        <Typography variant="body2" sx={{ color: 'rgba(15, 23, 42, 0.75)' }}>
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  </Box>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node.isRequired,
  gradient: PropTypes.string.isRequired,
};

StatCard.defaultProps = {
  subtitle: undefined,
};

const LibrarianDashboard = () => {
  const booksQuery = useQuery({
    queryKey: ['books', { page: 1, pageSize: 1 }],
    queryFn: () => listBooks({ page: 1, pageSize: 1 }),
  });

  const membersQuery = useQuery({
    queryKey: ['members', { page: 1, pageSize: 1 }],
    queryFn: () => listMembers({ page: 1, pageSize: 1 }),
  });

  const borrowQuery = useQuery({
    queryKey: ['borrowRecords', { status: 'ISSUED' }],
    queryFn: () => listBorrowRecords({ status: 'ISSUED' }),
  });

  const isLoading = booksQuery.isLoading || membersQuery.isLoading || borrowQuery.isLoading;
  const isError = booksQuery.isError || membersQuery.isError || borrowQuery.isError;

  if (isError) {
    return <Alert severity="error">Unable to load dashboard data.</Alert>;
  }

  const totalBooks = booksQuery.data?.meta?.total ?? 0;
  const totalMembers = membersQuery.data?.meta?.total ?? 0;
  const issuedBooks = borrowQuery.data?.filter((record) => record.status === 'ISSUED').length ?? 0;

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Librarian Control Center"
        subtitle="Stay on top of the entire library with real-time stats and shortcuts."
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Books"
            value={isLoading ? '...' : totalBooks}
            icon={<LibraryBooks />}
            gradient="linear-gradient(135deg, rgba(99,102,241,0.28), rgba(56,189,248,0.32))"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Members"
            value={isLoading ? '...' : totalMembers}
            icon={<Group />}
            gradient="linear-gradient(135deg, rgba(16,185,129,0.25), rgba(59,130,246,0.32))"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Books Issued"
            value={isLoading ? '...' : issuedBooks}
            subtitle="Currently issued to members"
            icon={<AssignmentTurnedIn />}
            gradient="linear-gradient(135deg, rgba(249,115,22,0.28), rgba(239,68,68,0.28))"
          />
        </Grid>
      </Grid>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          p: 3,
          borderRadius: 4,
          background: '#ffffff',
          boxShadow: '0px 15px 40px rgba(15, 23, 42, 0.08)',
          border: '1px solid rgba(148,163,184,0.18)',
        }}
      >
        <Box flex={1}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Quick Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the navigation menu to add new books, onboard members, and manage issuing activity.
            Insights update instantly as you take action.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            px: 3,
            py: 2,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(14,165,233,0.2))',
            color: '#312e81',
            fontWeight: 600,
          }}
        >
          Stay organized. Stay inspired.
        </Box>
      </Stack>
    </Stack>
  );
};

export default LibrarianDashboard;

