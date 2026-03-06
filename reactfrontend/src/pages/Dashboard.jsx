import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Target,
    FileText,
    BarChart2,
    Award,
    MessageSquare,
    ArrowRight,
    MoreHorizontal,
    Star,
    Zap,
    RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
    const [readinessData, setReadinessData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    const loadData = () => {
        setIsLoading(true);
        setFetchError(false);
        const token = localStorage.getItem('access_token');
        fetch('http://localhost:8000/api/readiness/dashboard-stats/', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
            .then(res => { if (!res.ok) throw new Error('Server error'); return res.json(); })
            .then(data => {
                setReadinessData(data);
            })
            .catch(err => {
                console.error("Failed to fetch dashboard metrics", err);
                setFetchError(true);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const readinessScore = readinessData?.metrics?.readiness_percentage || 0;
    const pieData = [
        { name: 'Score', value: readinessScore },
        { name: 'Remaining', value: 100 - readinessScore }
    ];

    const COLORS = ['#FFFFFF', 'rgba(255, 255, 255, 0.2)'];

    // Fallback tasks if AI Roadmap fails to load or while loading
    const defaultTasks = [
        { id: 1, title: 'Upload resume for scoring', category: 'Resume', status: 'pending', priority: 'High' },
        { id: 2, title: 'Take a mock interview', category: 'Interviews', status: 'pending', priority: 'High' }
    ];

    const displayTasks = readinessData?.ai_roadmap ?
        readinessData.ai_roadmap.map((taskObj, i) => ({
            id: i,
            title: typeof taskObj === 'string' ? taskObj : taskObj.title,
            category: typeof taskObj === 'string' ? 'AI Suggestion' : taskObj.category,
            status: 'pending',
            priority: typeof taskObj === 'string' ? (i === 0 ? 'High' : 'Medium') : taskObj.priority
        })) : defaultTasks;

    const quickStats = [
        { label: 'Resume Score', value: `${readinessData?.metrics?.resume_score || 0}`, icon: FileText, color: 'text-indigo-600' },
        { label: 'Interview Avg', value: `${readinessData?.metrics?.interview_score || 0}/100`, icon: TrendingUp, color: 'text-emerald-600' },
        { label: 'Test Score', value: `${readinessData?.metrics?.test_score || 0}`, icon: Zap, color: 'text-amber-600' }
    ];

    const getGreeting = () => {
        // Use explicit IST timezone so the greeting is always accurate in India
        const hour = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false });
        const h = parseInt(hour, 10);
        if (h >= 5 && h < 12) return 'Good morning';
        if (h >= 12 && h < 17) return 'Good afternoon';
        if (h >= 17 && h < 21) return 'Good evening';
        return 'Good night';
    };

    if (isLoading) return (
        <div className="dashboard-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
        </div>
    );

    if (fetchError) return (
        <div className="dashboard-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>⚠️</div>
            <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Cannot connect to server</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Make sure the backend is running at port 8000.</p>
            <button onClick={loadData} style={{ padding: '0.6rem 1.5rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginTop: '0.5rem' }}>Retry</button>
        </div>
    );

    return (
        <div className="dashboard-wrapper">
            {/* Header with Personalized Greeting */}
            <div className="page-header decorative">
                <div className="header-greeting">
                    <h1 className="page-title">{getGreeting()}, {readinessData?.user_info?.name || 'Student'}! ✨</h1>
                    <p className="page-subtitle">You're in the top 15% of your batch. Keep up the great work!</p>
                </div>
                <div className="header-badges">
                    <div className="status-badge pulse">
                        <Star size={14} fill="currentColor" />
                        Beta Member
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Hero Overall Score Card */}
                <div className="hero-score-card animate-slide-up">
                    <div className="hero-content">
                        <div className="hero-status status-improving">
                            <TrendingUp size={16} />
                            Ready for Placement
                        </div>
                        <h2 className="hero-greeting">Placement Readiness Index</h2>
                        <p className="hero-desc">Your overall probability of getting placed in Tier-1 companies based on current scores.</p>

                        <div className="hero-details">
                            <div className="hero-detail-item">
                                <span className="h-label">Focus Area</span>
                                <span className="h-value">{readinessData?.ai_roadmap && readinessData.ai_roadmap.length > 0 ? (typeof readinessData.ai_roadmap[0] === 'string' ? readinessData.ai_roadmap[0].split(' ').slice(0, 2).join(' ') : (readinessData.ai_roadmap[0].category || 'General Aptitude')) : 'General Aptitude'}</span>
                            </div>
                            <div className="hero-detail-divider"></div>
                            <div className="hero-detail-item">
                                <span className="h-label">Top Priority</span>
                                <span className="h-value">{readinessData?.ai_roadmap && readinessData.ai_roadmap.length > 0 ? (typeof readinessData.ai_roadmap[0] === 'string' ? 'Review Plan' : (readinessData.ai_roadmap[0].title ? String(readinessData.ai_roadmap[0].title).split(' ').slice(0, 3).join(' ') : 'Complete 1 Mock')) : 'Complete 1 Mock'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-viz">
                        <div className="viz-wrapper" style={{ height: '250px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="75%"
                                        outerRadius="95%"
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                        paddingAngle={0}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="viz-number">
                                {readinessScore}<span>%</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Blobs */}
                    <div className="hero-blob b1"></div>
                    <div className="hero-blob b2"></div>
                </div>

                {/* Next Actions Side Panel */}
                <div className="tasks-panel animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="panel-header">
                        <h3 className="panel-title">
                            <Target size={18} className="text-primary" />
                            Accelerated Action Plan
                        </h3>
                        <button className="icon-btn-minimal"><MoreHorizontal size={18} /></button>
                    </div>

                    <div className="task-scroll">
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto', color: 'var(--primary)' }} />
                            </div>
                        ) : (
                            displayTasks.map(task => (
                                <div key={task.id} className="task-row">
                                    <div className={`priority-indicator ${task.priority.toLowerCase()}`}></div>
                                    <div className="task-info">
                                        <div className="task-text">{task.title}</div>
                                        <div className="task-sub">
                                            <span className="task-tag">{task.category}</span>
                                            <span className="dot"></span>
                                            <span className="task-due">{task.priority} Priority</span>
                                        </div>
                                    </div>
                                    <button className="task-check">
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Secondary Row - Stats & Modules */}
                <div className="stats-row animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="stats-grid-mini">
                        {quickStats.map((stat, i) => (
                            <div key={i} className="mini-stat-card">
                                <div className="mini-icon">
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                                <div className="mini-content">
                                    <div className="mini-value">{stat.value}</div>
                                    <div className="mini-label">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="modules-compact-grid">
                        <Link to="/resume" className="compact-module m-indigo">
                            <FileText size={20} />
                            <span>Resume</span>
                            <ArrowRight size={14} className="m-arrow" />
                        </Link>
                        <Link to="/tests" className="compact-module m-emerald">
                            <BarChart2 size={20} />
                            <span>Tests</span>
                            <ArrowRight size={14} className="m-arrow" />
                        </Link>
                        <Link to="/certifications" className="compact-module m-amber">
                            <Award size={20} />
                            <span>Skills</span>
                            <ArrowRight size={14} className="m-arrow" />
                        </Link>
                        <Link to="/interviews" className="compact-module m-pink">
                            <MessageSquare size={20} />
                            <span>Mocks</span>
                            <ArrowRight size={14} className="m-arrow" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
