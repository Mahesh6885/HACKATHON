import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Target,
    FileText,
    BarChart2,
    Award,
    MessageSquare,
    ArrowRight,
    MoreHorizontal
} from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
    const readinessScore = 68;
    const pieData = [
        { name: 'Score', value: readinessScore },
        { name: 'Remaining', value: 100 - readinessScore, fill: 'var(--border)' }
    ];

    const COLORS = ['var(--primary)', 'var(--bg-primary)'];

    const tasks = [
        { id: 1, title: 'Update resume project section', category: 'Resume', status: 'pending' },
        { id: 2, title: 'Take aptitude test weekly', category: 'Tests', status: 'pending' },
        { id: 3, title: 'Complete AWS Cloud Practitioner', category: 'Certifications', status: 'in-progress' },
        { id: 4, title: 'Attend 2 mock interviews', category: 'Interviews', status: 'pending' }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Overview</h1>
                <p className="page-subtitle">Welcome back, John! Here's your current placement readiness status.</p>
            </div>

            <div className="dashboard-grid">

                {/* Overall Score Card */}
                <div className="score-card">
                    <div className="score-content">
                        <h2 className="score-greeting">You're doing great! 🚀</h2>
                        <div className="score-status status-improving">
                            <TrendingUp size={16} />
                            Improving
                        </div>

                        <div className="score-details">
                            <div className="detail-item">
                                <span className="detail-label">Top Gap Area</span>
                                <span className="detail-value">Aptitude Tests</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Completed Modules</span>
                                <span className="detail-value">2/4</span>
                            </div>
                        </div>
                    </div>

                    <div className="score-circle-container">
                        <PieChart width={160} height={160}>
                            <Pie
                                data={pieData}
                                cx={80}
                                cy={80}
                                innerRadius={60}
                                outerRadius={80}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="score-number">
                            {readinessScore}<span>%</span>
                        </div>
                    </div>
                </div>

                {/* Action Plan Tasks */}
                <div className="tasks-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Target size={18} color="var(--primary)" />
                            Next Actions
                        </h3>
                        <button className="icon-button"><MoreHorizontal size={18} /></button>
                    </div>

                    <div className="task-list">
                        {tasks.map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-checkbox">
                                    {/* Empty checkbox simulating unchecked status */}
                                </div>
                                <div className="task-content">
                                    <div className="task-title">{task.title}</div>
                                    <div className="task-meta">
                                        <span className={`badge ${task.status === 'in-progress' ? 'badge-warning' : ''}`} style={task.status === 'pending' ? { background: 'var(--bg-primary)', padding: 0 } : {}}>
                                            {task.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modules Quick Access */}
                <div className="modules-grid">

                    <Link to="/resume" className="module-card">
                        <div className="module-icon-bg bg-indigo">
                            <FileText size={24} />
                        </div>
                        <h3 className="module-title">Resume Quality</h3>
                        <p className="module-desc">ATS score and feedback based on industry standards.</p>
                        <div className="module-footer">
                            <span className="module-stat">Score: 75/100</span>
                            <span className="module-link">Review <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/tests" className="module-card">
                        <div className="module-icon-bg bg-pink">
                            <BarChart2 size={24} />
                        </div>
                        <h3 className="module-title">Test Scores</h3>
                        <p className="module-desc">Aptitude, coding, and domain assessments.</p>
                        <div className="module-footer">
                            <span className="module-stat">Avg: 62%</span>
                            <span className="module-link">View Trend <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/certifications" className="module-card">
                        <div className="module-icon-bg bg-emerald">
                            <Award size={24} />
                        </div>
                        <h3 className="module-title">Certifications</h3>
                        <p className="module-desc">Track earned badges and completed courses.</p>
                        <div className="module-footer">
                            <span className="module-stat">2 Earned</span>
                            <span className="module-link">Add New <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                    <Link to="/interviews" className="module-card">
                        <div className="module-icon-bg bg-amber">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="module-title">Interviews</h3>
                        <p className="module-desc">Mock interview feedback and communication ratings.</p>
                        <div className="module-footer">
                            <span className="module-stat">1 Mock Done</span>
                            <span className="module-link">See Notes <ArrowRight size={14} /></span>
                        </div>
                    </Link>

                </div>

            </div>
        </div>
    );
}
