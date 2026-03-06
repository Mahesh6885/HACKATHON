import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    FileText,
    BarChart2,
    Award,
    MessageSquare,
    Users,
    Search,
    Bell,
    LogOut,
    GraduationCap,
    Map,
    Settings
} from 'lucide-react';
import './AppLayout.css';

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);

    // Get userRole from localStorage; fallback to student
    const userRole = localStorage.getItem('userRole') || 'student';

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        fetch('http://localhost:8000/api/auth/profile/', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
            .then(res => res.json())
            .then(data => {
                setUserData(data);
                if (data.role && data.role !== userRole && false) { // disable forced redirect override for now
                    localStorage.setItem('userRole', data.role);
                }
            })
            .catch(err => console.error("Failed to load user profile", err));
    }, [userRole]);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <GraduationCap size={28} />
                    </div>
                    <div className="sidebar-brand">SkillSprint</div>
                </div>

                <nav className="sidebar-nav">
                    {userRole === 'admin' ? (
                        <>
                            <NavLink to="/admin" className={({ isActive }) => isActive || location.pathname === '/admin' ? "nav-item active" : "nav-item"}>
                                <Users size={20} />
                                <span>Admin Dashboard</span>
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <LayoutDashboard size={20} />
                                <span>Dashboard</span>
                            </NavLink>

                            <NavLink to="/resume" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <FileText size={20} />
                                <span>Resume Screen</span>
                            </NavLink>

                            <NavLink to="/tests" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <BarChart2 size={20} />
                                <span>Test Scores</span>
                            </NavLink>

                            <NavLink to="/certifications" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <Award size={20} />
                                <span>Certifications</span>
                            </NavLink>

                            <NavLink to="/interviews" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <MessageSquare size={20} />
                                <span>Mock Interviews</span>
                            </NavLink>

                            <NavLink to="/roadmap" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <Map size={20} />
                                <span>AI Roadmap</span>
                            </NavLink>

                            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <Settings size={20} />
                                <span>Settings</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">{userRole === 'admin' ? 'AD' : (userData?.display_name ? userData.display_name.substring(0, 2).toUpperCase() : '..')}</div>
                        <div className="user-info">
                            <span className="user-name">{userRole === 'admin' ? 'Administrator' : (userData?.display_name || 'Loading...')}</span>
                            <span className="user-role">{userRole === 'admin' ? 'Placement Cell' : (userData?.role_desc || 'Loading...')}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-wrapper">
                <header className="top-header">
                    <div className="header-search">
                        <Search size={18} color="var(--text-muted)" />
                        <input type="text" placeholder={userRole === 'admin' ? "Search students, departments..." : "Search tasks, tests..."} className="search-input" />
                    </div>

                    <div className="header-actions">
                        <button className="icon-button">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <button className="icon-button" onClick={handleLogout} title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <div className="content-area animate-fade-in">
                    <Outlet /> {/* Renders the current route's component */}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
