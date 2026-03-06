import { useState, useEffect } from 'react';
import {
    Users, TrendingUp, AlertCircle, Award,
    Calendar, ArrowUpRight, BarChart3, Clock,
    CheckCircle2, Building2, Briefcase, Loader2
} from 'lucide-react';
import './AdminDashboard.css';

const DEPT_COLORS = { CSE: '#2563eb', IT: '#16a34a', ECE: '#ca8a04', MECH: '#dc2626' };

export default function AdminDashboard() {
    const [apiStats, setApiStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    const loadData = () => {
        setIsLoading(true);
        setFetchError(false);
        fetch('http://localhost:8000/api/admin/dashboard/')
            .then(r => { if (!r.ok) throw new Error('Server error'); return r.json(); })
            .then(data => {
                setApiStats(data.stats);
                setStudents(data.students || []);
            })
            .catch(err => { console.error('AdminDashboard fetch error:', err); setFetchError(true); })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    // Derive metrics from real student data
    const total = apiStats?.total_students ?? 0;
    const avgReadiness = apiStats?.avg_readiness ?? 0;
    const atRisk = apiStats?.at_risk_count ?? 0;
    const placed = Math.max(0, total - atRisk);   // students NOT at-risk are considered placed-track

    // Build department breakdown from real student list
    const deptMap = {};
    students.forEach(s => {
        if (!deptMap[s.dept]) deptMap[s.dept] = { students: 0, totalReadiness: 0 };
        deptMap[s.dept].students += 1;
        deptMap[s.dept].totalReadiness += s.readiness;
    });
    const deptStats = Object.entries(deptMap).map(([dept, d]) => ({
        dept,
        students: d.students,
        readiness: Math.round(d.totalReadiness / d.students),
        color: DEPT_COLORS[dept] || '#6366f1',
    }));

    const stats = [
        { label: 'Total Students', value: total, icon: Users, cls: 'blue-icon', trade: '+12%' },
        { label: 'Placed Students', value: placed, icon: Award, cls: 'green-icon', trade: '+5%' },
        { label: 'Unplaced Students', value: atRisk, icon: AlertCircle, cls: 'red-icon', trade: '-2%' },
        { label: 'Avg Readiness', value: `${avgReadiness}%`, icon: TrendingUp, cls: 'indigo-icon', trade: '+8%' },
    ];

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (isLoading) return (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
            <p>Loading live data...</p>
        </div>
    );

    if (fetchError || !apiStats) return (
        <div style={{ textAlign: 'center', padding: '6rem' }}>
            <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 1rem', display: 'block' }} />
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Cannot connect to server</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Make sure the Django backend is running on port 8000.</p>
            <button onClick={loadData} style={{ padding: '0.6rem 1.5rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
    );

    return (
        <div className="admin-dashboard-enhanced">
            {/* 1. Hero Welcome Section */}
            <div className="adash-hero">
                <div className="adash-hero-content">
                    <h1 className="adash-hero-title">Welcome back, Admin! 👋</h1>
                    <p className="adash-hero-sub">The 2026 Placement Season is in full swing. Here's what's happening today, {today}.</p>
                    <div className="adash-hero-badges">
                        <span className="hero-badge"><Clock size={14} /> Season Active</span>
                        <span className="hero-badge secondary"><Building2 size={14} /> 12 Active Recruiters</span>
                    </div>
                </div>
                <div className="adash-hero-viz">
                    <div className="viz-circle">
                        <div className="viz-inner">
                            <span className="viz-num">{avgReadiness}%</span>
                            <span className="viz-label">Total Readiness</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Top Stats Row */}
            <div className="adash-stats-row">
                {stats.map(({ label, value, icon: Icon, cls, trade }) => (
                    <div key={label} className="adash-stat-card-new">
                        <div className="stat-card-top">
                            <div className={`stat-icon-wrap ${cls}`}><Icon size={20} /></div>
                            <span className={`stat-trend ${trade.startsWith('+') ? 'up' : 'down'}`}>
                                {trade} <ArrowUpRight size={14} />
                            </span>
                        </div>
                        <div className="stat-card-body">
                            <div className="stat-val">{value}</div>
                            <div className="stat-lab">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Main Data Grid (2 Columns) */}
            <div className="adash-data-grid">
                {/* Left: Department Performance */}
                <div className="adash-section-card performance-card">
                    <div className="card-header-flex">
                        <h2 className="section-title">Department Readiness</h2>
                        <button className="text-btn">View All</button>
                    </div>
                    <div className="dept-perf-list">
                        {deptStats.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All students are in one department.</p>
                        ) : deptStats.map(d => (
                            <div key={d.dept} className="dept-perf-item">
                                <div className="dept-info">
                                    <span className="dept-name">{d.dept}</span>
                                    <span className="dept-count">{d.students} Students</span>
                                </div>
                                <div className="dept-bar-group">
                                    <div className="dept-bar-bg">
                                        <div
                                            className="dept-bar-fill"
                                            style={{ width: `${d.readiness}%`, background: d.color }}
                                        ></div>
                                    </div>
                                    <span className="dept-percent">{d.readiness}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Recent Activity Feed */}
                <div className="adash-section-card activity-card">
                    <div className="card-header-flex">
                        <h2 className="section-title">Recent Activity</h2>
                        <Clock size={16} className="text-muted" />
                    </div>
                    <div className="activity-feed">
                        {students.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem 0' }}>No recent activity.</p>
                        ) : students
                            .filter(s => s.last_active && s.last_active !== 'Never')
                            .slice(0, 5)
                            .map(s => (
                                <div key={s.id} className="activity-item">
                                    <div className="activity-icon act-blue">
                                        <Users size={16} />
                                    </div>
                                    <div className="activity-body">
                                        <p className="activity-text">{s.name} was active</p>
                                        <span className="activity-time">{s.last_active}</span>
                                    </div>
                                    <ArrowUpRight size={16} className="activity-arrow" />
                                </div>
                            ))
                        }
                    </div>
                    <button className="activity-more-btn">See Full History</button>
                </div>
            </div>

            {/* 4. Bottom Row: Upcoming / Shortcuts */}
            <div className="adash-shortcuts">
                <div className="shortcut-card">
                    <CheckCircle2 size={20} />
                    <span>Upload Mock results</span>
                </div>
                <div className="shortcut-card">
                    <Briefcase size={20} />
                    <span>Add New Job Opening</span>
                </div>
                <div className="shortcut-card">
                    <Calendar size={20} />
                    <span>Schedule Batch Test</span>
                </div>
            </div>
        </div>
    );
}
