import { useState } from 'react';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../api/users';
import PageHeader from '../components/PageHeader.jsx';

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [localError, setLocalError] = useState('');
  const mutation = useMutation({ mutationFn: changePassword });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setLocalError('All fields are required');
      return;
    }
    if (form.newPassword.length < 6) {
      setLocalError('New password must be at least 6 characters');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setLocalError('New password and confirm password do not match');
      return;
    }
    mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <Stack spacing={3} alignItems="center">
      <PageHeader
        title="Change Password"
        subtitle="Keep your account secure by updating your password regularly."
      />
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, md: 4 },
          width: '100%',
          maxWidth: 520,
          borderRadius: 4,
          border: '1px solid rgba(148,163,184,0.16)',
          boxShadow: '0px 18px 42px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Stack spacing={2.5}>
          <Typography variant="h5" fontWeight={700}>
            Update your credentials
          </Typography>
          {localError ? <Alert severity="error">{localError}</Alert> : null}
          {mutation.isError ? (
            <Alert severity="error">
              {mutation.error?.response?.data?.message || 'Failed to change password'}
            </Alert>
          ) : null}
          {mutation.isSuccess ? <Alert severity="success">Password updated successfully.</Alert> : null}
          <TextField
            name="currentPassword"
            label="Current Password"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="newPassword"
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ChangePassword;







