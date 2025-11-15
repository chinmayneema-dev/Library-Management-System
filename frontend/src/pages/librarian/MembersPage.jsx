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
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Add, Refresh, Visibility, VisibilityOff } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { addMember, listMembers } from '../../api/members';
import { formatDate } from '../../utils/format';
import PageHeader from '../../components/PageHeader.jsx';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  membershipDate: dayjs().format('YYYY-MM-DD'),
  password: '',
};

const MembersPage = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);

  const membersQuery = useQuery({
    queryKey: ['members', { page: 1, pageSize: 100 }],
    queryFn: () => listMembers({ page: 1, pageSize: 100 }),
  });

  const addMutation = useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      handleCloseDialog();
    },
  });

  const handleOpenDialog = () => {
    setFormState(initialFormState);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    addMutation.reset();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addMutation.mutate(formState);
  };

  const members = useMemo(() => membersQuery.data?.data ?? [], [membersQuery.data]);

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Members Directory"
        subtitle="View and onboard members, assign login credentials, and manage contact information."
        action={(
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => queryClient.invalidateQueries({ queryKey: ['members'] })}
            >
              Refresh
            </Button>
            <Button startIcon={<Add />} onClick={handleOpenDialog}>
              Add Member
            </Button>
          </Stack>
        )}
      />

      {membersQuery.isError ? <Alert severity="error">Unable to load members.</Alert> : null}

      <TableContainer
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(148,163,184,0.18)',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(14,165,233,0.18))',
                '& th': { fontWeight: 600, borderBottom: 'none' },
              }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Member Since</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member.memberId}
                sx={{
                  '& td': { borderBottomColor: 'rgba(148,163,184,0.15)' },
                }}
              >
                <TableCell>
                  <Stack spacing={0.4}>
                    <Box sx={{ fontWeight: 600 }}>{member.name}</Box>
                    <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{member.address || '—'}</Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.address || '—'}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      px: 1.5,
                      py: 0.5,
                      bgcolor: 'rgba(99,102,241,0.12)',
                      color: '#312e81',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(member.membershipDate)}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && !membersQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No members found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} component="form" onSubmit={handleSubmit} fullWidth maxWidth="sm">
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" name="name" value={formState.name} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" value={formState.email} onChange={handleChange} required fullWidth />
            <TextField label="Phone" name="phone" value={formState.phone} onChange={handleChange} required fullWidth />
            <TextField label="Address" name="address" value={formState.address} onChange={handleChange} fullWidth />
            <TextField
              label="Membership Date"
              name="membershipDate"
              type="date"
              value={formState.membershipDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Temporary Password (optional)"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formState.password}
              onChange={handleChange}
              helperText="Leave blank if not creating login yet"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button type="submit" disabled={addMutation.isLoading}>
            {addMutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default MembersPage;







