import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import Tests from './pages/Tests';
import Certifications from './pages/Certifications';
import Interviews from './pages/Interviews';
import AdminDashboard from './pages/AdminDashboard';
import StudentMaintenance from './pages/StudentMaintenance';
import StudentProfile from './pages/StudentProfile';
import Roadmap from './pages/Roadmap';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Admin Routes — Dark Glass Theme */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentMaintenance />} />
          <Route path="students/:id" element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;