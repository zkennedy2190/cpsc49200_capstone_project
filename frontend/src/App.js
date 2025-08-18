import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import GuardianDashboard from './pages/GuardianDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/guardian" element={<GuardianDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;