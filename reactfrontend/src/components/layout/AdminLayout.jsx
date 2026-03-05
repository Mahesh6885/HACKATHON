import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, GraduationCap, Settings, Search, Bell } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Dark Glassmorphism Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-logo-icon">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <div className="admin-brand">SkillSprint</div>
                    </div>
                </div>

                <nav className="admin-nav">
                    <div className="admin-nav-label">Main</div>
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/students"
                        className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
                    >
                        <Users size={20} />
                        <span>Student Maintenance</span>
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <div className="admin-search-bar">
                        <Search size={16} />
                        <input type="text" placeholder="Search students, departments..." />
                    </div>
                    <div className="admin-topbar-right">
                        <button className="admin-icon-btn">
                            <Bell size={20} />
                            <span className="admin-notif-dot"></span>
                        </button>
                        <div className="admin-profile">
                            <div className="admin-avatar">AD</div>
                            <div className="admin-profile-info">
                                <span className="admin-name">Administrator</span>
                                <span className="admin-role">Placement Officer</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
