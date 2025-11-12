import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Navigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formState, setFormState] = useState({ username: '', password: '' });

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data);
      if (data.user.role === 'LIBRARIAN') {
        navigate('/librarian', { replace: true });
      } else {
        navigate('/member', { replace: true });
      }
    },
  });

  if (isAuthenticated) {
    return <Navigate to={user.role === 'LIBRARIAN' ? '/librarian' : '/member'} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await mutateAsync(formState);
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          border: '1px solid rgba(148,163,184,0.18)',
          boxShadow: '0px 30px 80px rgba(79, 70, 229, 0.18)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,245,249,0.96))',
        }}
      >
        <Stack spacing={3}>
          <Box textAlign="center">
            <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
              Library Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your personalised dashboard.
            </Typography>
          </Box>
          {error ? (
            <Alert severity="error">
              {error.response?.data?.message || 'Invalid credentials'}
            </Alert>
          ) : null}
          <TextField
            label="Username"
            name="username"
            autoComplete="username"
            value={formState.username}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formState.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" disabled={isLoading} fullWidth sx={{ py: 1.4 }}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;







