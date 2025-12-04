import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register.jsx';
import Books from './pages/Books.jsx';
import Authors from './pages/Authors.jsx';
import Users from './pages/Users.jsx';
import BorrowedBooks from './pages/BorrowedBooks.jsx';

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={token ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Books />} />
          <Route path="books" element={<Books />} />
          <Route path="authors" element={<Authors />} />
          <Route path="users" element={<Users />} />
          <Route path="borrowed" element={<BorrowedBooks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
