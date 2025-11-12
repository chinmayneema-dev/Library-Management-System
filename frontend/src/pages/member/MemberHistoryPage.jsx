import {
  Alert,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { listBorrowRecords } from '../../api/borrow';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatStatus } from '../../utils/format';
import PageHeader from '../../components/PageHeader.jsx';

const MemberHistoryPage = () => {
  const { user } = useAuth();

  const historyQuery = useQuery({
    queryKey: ['borrowRecords', { memberId: user.memberId, history: true }],
    queryFn: () => listBorrowRecords({ memberId: user.memberId }),
  });

  if (historyQuery.isError) {
    return <Alert severity="error">Unable to load history.</Alert>;
  }

  const records = historyQuery.data ?? [];

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Borrow History"
        subtitle="Track every book you have issued and returned."
      />
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
              background: 'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(14,165,233,0.18))',
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Issue Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.borrowId}>
                <TableCell>{record.book?.title}</TableCell>
                <TableCell>{formatDate(record.issueDate)}</TableCell>
                <TableCell>{formatDate(record.dueDate)}</TableCell>
                <TableCell>{formatDate(record.returnDate)}</TableCell>
                <TableCell>{formatStatus(record.status)}</TableCell>
              </TableRow>
            ))}
            {records.length === 0 && !historyQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No borrow records found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default MemberHistoryPage;







