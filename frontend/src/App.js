import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ParentDashboard from './pages/ParentDashboard';
import GuardianDashboard from './pages/GuardianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecordingsLibraryPage from './pages/RecordingsLibraryPage';
import SchedulePage from './pages/SchedulePage';
import BookSelectionPage from './pages/BookSelectionPage';
import PrivateRoute from './PrivateRoute';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recordings" element={<PrivateRoute element={<RecordingsLibraryPage />} />} />
        <Route
          path="/volunteer"
          element={<PrivateRoute roles={['volunteer']} element={<VolunteerDashboard />} />}
        />
        <Route
          path="/parent"
          element={<PrivateRoute roles={['parent']} element={<ParentDashboard />} />}
        />
        <Route
          path="/guardian"
          element={<PrivateRoute roles={['guardian']} element={<GuardianDashboard />} />}
        />
        <Route
          path="/admin"
          element={<PrivateRoute roles={['admin']} element={<AdminDashboard />} />}
        />
        <Route
          path="/schedule"
          element={<PrivateRoute roles={['volunteer']} element={<SchedulePage />} />}
        />
        <Route path="/book-selection" element={<BookSelectionPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;