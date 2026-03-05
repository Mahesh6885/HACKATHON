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
    Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
    const readinessScore = 68;
    const pieData = [
        { name: 'Score', value: readinessScore },
        { name: 'Remaining', value: 100 - readinessScore }
    ];

    const COLORS = ['#FFFFFF', 'rgba(255, 255, 255, 0.2)'];

    const tasks = [
        { id: 1, title: 'Update resume project section', category: 'Resume', status: 'pending', priority: 'High' },
        { id: 2, title: 'Take aptitude test weekly', category: 'Tests', status: 'pending', priority: 'Medium' },
        { id: 3, title: 'Complete AWS Cloud Practitioner', category: 'Certifications', status: 'in-progress', priority: 'High' },
        { id: 4, title: 'Attend 2 mock interviews', category: 'Interviews', status: 'pending', priority: 'Low' }
    ];

    const quickStats = [
        { label: 'Completed Tests', value: '12', icon: Zap, color: 'text-indigo-600' },
        { label: 'Avg. Percentile', value: '84%', icon: TrendingUp, color: 'text-emerald-600' },
        { label: 'Certifications', value: '3', icon: Award, color: 'text-amber-600' }
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="dashboard-wrapper">
            {/* Header with Personalized Greeting */}
            <div className="page-header decorative">
                <div className="header-greeting">
                    <h1 className="page-title">{getGreeting()}, John! ✨</h1>
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
                                <span className="h-value">Logical Reasoning</span>
                            </div>
                            <div className="hero-detail-divider"></div>
                            <div className="hero-detail-item">
                                <span className="h-label">Daily Goal</span>
                                <span className="h-value">1 Mock Test</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-viz">
                        <div className="viz-wrapper">
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
                        {tasks.map(task => (
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
                        ))}
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
