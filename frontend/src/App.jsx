import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import Login from './pages/Login.jsx';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard.jsx';
import BooksPage from './pages/librarian/BooksPage.jsx';
import MembersPage from './pages/librarian/MembersPage.jsx';
import BorrowPage from './pages/librarian/BorrowPage.jsx';
import SearchPage from './pages/librarian/SearchPage.jsx';
import MemberDashboard from './pages/member/MemberDashboard.jsx';
import MemberSearchPage from './pages/member/MemberSearchPage.jsx';
import MemberHistoryPage from './pages/member/MemberHistoryPage.jsx';
import { useAuth } from './hooks/useAuth.js';
import ChangePassword from './pages/ChangePassword.jsx';

const App = () => {
  const { isAuthenticated, user } = useAuth();

  const defaultPath = () => {
    if (!isAuthenticated) return '/login';
    return user.role === 'LIBRARIAN' ? '/librarian' : '/member';
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to={defaultPath()} replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute roles={['LIBRARIAN']} />}>
            <Route path="/librarian" element={<LibrarianDashboard />} />
            <Route path="/librarian/books" element={<BooksPage />} />
            <Route path="/librarian/members" element={<MembersPage />} />
            <Route path="/librarian/borrow" element={<BorrowPage />} />
            <Route path="/librarian/search" element={<SearchPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['MEMBER']} />}>
            <Route path="/member" element={<MemberDashboard />} />
            <Route path="/member/search" element={<MemberSearchPage />} />
            <Route path="/member/history" element={<MemberHistoryPage />} />
          </Route>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={defaultPath()} replace />} />
    </Routes>
  );
};

export default App;
