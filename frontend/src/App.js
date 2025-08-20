// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';


// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutUsPage';
import BookSelectionPage from './pages/BookSelectionPage';
import RecordingsLibraryPage from './pages/RecordingsLibraryPage';
import SchedulePage from './pages/SchedulePage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ParentDashboard from './pages/ParentDashboard';
import GuardianDashboard from './pages/GuardianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RecordPage from './pages/RecordPage';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/books" element={<BookSelectionPage />} />

        {/* Routes requiring authentication */}
        <Route
          path="/recordings"
          element={
            <PrivateRoute>
              <RecordingsLibraryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <SchedulePage />
            </PrivateRoute>
          }
        />

        {/* Role-specific dashboards */}
        <Route
          path="/volunteer"
          element={
            <PrivateRoute requiredRole="volunteer">
              <VolunteerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/parent"
          element={
            <PrivateRoute requiredRole="parent">
              <ParentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/guardian"
          element={
            <PrivateRoute requiredRole="guardian">
              <GuardianDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/record"
          element={
            <PrivateRoute requiredRole="volunteer">
              <RecordPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
