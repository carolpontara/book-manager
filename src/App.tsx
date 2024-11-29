import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import LoginPage from './pages/LoginPage';
import BookList from './pages/BookList';
import BookDetailPage from './pages/BookDetailPage';
import { AuthProvider } from './context/AuthContext';
import ManageBooks from './pages/ManageBooks';
import EditBook from './pages/EditBook';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/manage-books" element={<ManageBooks />} />
              <Route path="/books/edit/:id" element={<EditBook />} />

{/* <Route path="/manage-users" element={<ManageUsers />} /> */}

            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
