import {
    Users, TrendingUp, AlertCircle, Award,
    Calendar, ArrowUpRight, BarChart3, Clock,
    CheckCircle2, Building2, Briefcase
} from 'lucide-react';
import './AdminDashboard.css';

const ALL_STUDENTS = [
    { id: 101, testScore: 85, placed: true },
    { id: 102, testScore: 62, placed: false },
    { id: 103, testScore: 40, placed: false },
    { id: 104, testScore: 92, placed: true },
    { id: 105, testScore: 55, placed: false },
    { id: 106, testScore: 78, placed: true },
    { id: 107, testScore: 70, placed: false },
    { id: 108, testScore: 80, placed: false },
];

const DEPT_STATS = [
    { dept: 'CSE', readiness: 88, students: 42, color: '#2563eb' },
    { dept: 'IT', readiness: 82, students: 38, color: '#16a34a' },
    { dept: 'ECE', readiness: 75, students: 35, color: '#ca8a04' },
    { dept: 'MECH', readiness: 68, students: 28, color: '#dc2626' },
];

const RECENT_ACTIVITY = [
    { id: 1, type: 'placement', text: '5 Students placed in Google', time: '2 hours ago', icon: Award, cls: 'act-blue' },
    { id: 2, type: 'test', text: 'Mock Test #4 Results Uploaded', time: '5 hours ago', icon: BarChart3, cls: 'act-green' },
    { id: 3, type: 'student', text: '22 New Students added to CSE', time: 'Yesterday', icon: Users, cls: 'act-indigo' },
    { id: 4, type: 'status', text: 'Amazon Interview scheduled for IT', time: 'Yesterday', icon: Calendar, cls: 'act-amber' },
];

export default function AdminDashboard() {
    const total = ALL_STUDENTS.length;
    const placed = ALL_STUDENTS.filter(s => s.placed).length;
    const unplaced = total - placed;
    const avgReadiness = Math.round(ALL_STUDENTS.reduce((a, s) => a + s.testScore, 0) / total);

    const stats = [
        { label: 'Total Students', value: total, icon: Users, cls: 'blue-icon', trade: '+12%' },
        { label: 'Placed Students', value: placed, icon: Award, cls: 'green-icon', trade: '+5%' },
        { label: 'Unplaced Students', value: unplaced, icon: AlertCircle, cls: 'red-icon', trade: '-2%' },
        { label: 'Avg Readiness', value: `${avgReadiness}%`, icon: TrendingUp, cls: 'indigo-icon', trade: '+8%' },
    ];

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
                        {DEPT_STATS.map(d => (
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
                        {RECENT_ACTIVITY.map(act => (
                            <div key={act.id} className="activity-item">
                                <div className={`activity-icon ${act.cls}`}>
                                    <act.icon size={16} />
                                </div>
                                <div className="activity-body">
                                    <p className="activity-text">{act.text}</p>
                                    <span className="activity-time">{act.time}</span>
                                </div>
                                <ArrowUpRight size={16} className="activity-arrow" />
                            </div>
                        ))}
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
