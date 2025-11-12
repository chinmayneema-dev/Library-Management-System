import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LibraryBooks,
  People,
  AssignmentReturn,
  Search,
  Dashboard,
  Logout,
  History,
  Lock,
} from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 270;

const roleNavItems = {
  LIBRARIAN: [
    { label: 'Dashboard', icon: <Dashboard />, to: '/librarian' },
    { label: 'Books', icon: <LibraryBooks />, to: '/librarian/books' },
    { label: 'Members', icon: <People />, to: '/librarian/members' },
    { label: 'Issue / Return', icon: <AssignmentReturn />, to: '/librarian/borrow' },
    { label: 'Search', icon: <Search />, to: '/librarian/search' },
    { label: 'Change Password', icon: <Lock />, to: '/change-password' },
  ],
  MEMBER: [
    { label: 'Dashboard', icon: <Dashboard />, to: '/member' },
    { label: 'Search', icon: <Search />, to: '/member/search' },
    { label: 'Borrow History', icon: <History />, to: '/member/history' },
    { label: 'Change Password', icon: <Lock />, to: '/change-password' },
  ],
};

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navItems = roleNavItems[user.role] || [];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1, py: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Stellar Library
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(229,231,235,0.7)' }}>
          Manage books & members elegantly
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(148,163,184,0.3)' }} />
      <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const selected = location.pathname === item.to;
          return (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={selected}
                sx={{
                  px: 2,
                  py: 1.2,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: selected
                      ? '0px 12px 24px rgba(99, 102, 241, 0.45)'
                      : '0px 10px 24px rgba(15, 23, 42, 0.25)',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ px: 3, pb: 3, pt: 1 }}>
        <Paper
          variant="outlined"
          sx={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(14,165,233,0.25))',
            borderColor: 'rgba(148,163,184,0.3)',
            color: '#e5e7eb',
            p: 2,
            textAlign: 'left',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Quick Tips
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'rgba(229,231,235,0.8)' }}>
            Use the search to quickly find books, or issue them from the dashboard shortcuts.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, rgba(255,255,255,0.55), rgba(226,232,240,0.8))',
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottomLeftRadius: { sm: 24, xs: 0 },
          borderBottomRightRadius: { sm: 24, xs: 0 },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user.username}
          </Typography>
          <Avatar sx={{ mr: 2 }}>{user.username.charAt(0).toUpperCase()}</Avatar>
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="menu">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              paddingTop: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(252,254,255,0.9) 100%)',
          position: 'relative',
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(129, 140, 248, 0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.12), transparent 45%)',
            zIndex: -1,
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;

