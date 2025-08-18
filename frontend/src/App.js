import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import GuardianDashboard from './pages/GuardianDashboard';
import LoginPage from './pages/LoginPage';
import RecordingsLibraryPage from './pages/RecordingsLibraryPage';
import BookSelectionPage from './pages/BookSelectionPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/guardian" element={<GuardianDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recordings" element={<RecordingsLibraryPage />} />
        <Route path="/books" element={<BookSelectionPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;