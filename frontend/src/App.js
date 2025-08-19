import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ParentDashboard from './pages/ParentDashboard';
import GuardianDashboard from './pages/GuardianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SchedulePage from './pages/SchedulePage';
import RecordingsLibraryPage from './pages/RecordingsLibraryPage';
import BookSelectionPage from './pages/BookSelectionPage';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Everyone logged in can view recordings */}
        <Route
          path="/recordings"
          element={<PrivateRoute element={<RecordingsLibraryPage />} />}
        />
        {/* Role-specific dashboards and schedule */}
        <Route
          path="/volunteer"
          element={
            <PrivateRoute roles={['volunteer']} element={<VolunteerDashboard />} />
          }
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
        {/* Book page is public */}
        <Route path="/book-selection" element={<BookSelectionPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;