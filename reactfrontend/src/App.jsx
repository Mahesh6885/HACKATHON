import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import Tests from './pages/Tests';
import Certifications from './pages/Certifications';
import Interviews from './pages/Interviews';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;