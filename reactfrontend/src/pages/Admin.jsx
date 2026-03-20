import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertCircle, Award, UserCheck, BookOpen, Search, Loader2, RefreshCw } from 'lucide-react';
import './Admin.css';

const BACKEND = 'http://localhost:8000';

export default function Admin() {
    const [viewMode, setViewMode] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [deptFilter, setDeptFilter] = useState('');
    const [scoreFilter, setScoreFilter] = useState('');

    // Maintenance tab
    const [rollInput, setRollInput] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const fetchDashboard = () => {
        setIsLoading(true);
        fetch(`${BACKEND}/api/admin/dashboard/`)
            .then(res => res.json())
            .then(data => {
                setStats(data.stats);
                setStudents(data.students);
            })
            .catch(err => console.error('Admin dashboard error:', err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { fetchDashboard(); }, []);

    const getScoreClass = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-med';
        return 'score-low';
    };

    const getInitials = (name) =>
        name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const handleInspect = async (roll) => {
        setRollInput(roll);
        setViewMode('maintenance');
        setIsSearching(true);
        setSearchError('');
        try {
            const res = await fetch(`${BACKEND}/api/admin/student/${encodeURIComponent(roll)}/`);
            const data = await res.json();
            if (!res.ok) { setSearchError(data.error || 'Not found'); setSearchedStudent(null); }
            else setSearchedStudent(data);
        } catch { setSearchError('Failed to fetch student data.'); }
        finally { setIsSearching(false); }
    };

    const handleSearch = () => handleInspect(rollInput.trim());

    // Apply client-side filters
    const filtered = students.filter(s => {
        const deptOk = !deptFilter || s.dept === deptFilter;
        const scoreOk = !scoreFilter
            || (scoreFilter === 'high' && s.readiness >= 80)
            || (scoreFilter === 'mid' && s.readiness >= 60 && s.readiness < 80)
            || (scoreFilter === 'low' && s.readiness < 60);
        return deptOk && scoreOk;
    });

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Placement Admin Hub</h1>
                    <p className="page-subtitle">Live batch analytics and student maintenance tools.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={fetchDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Refresh data">
                        <RefreshCw size={18} />
                    </button>
                    <div className="admin-tabs">
                        <button className={`tab-btn ${viewMode === 'dashboard' ? 'active' : ''}`} onClick={() => setViewMode('dashboard')}>
                            <TrendingUp size={16} /> Dashboard
                        </button>
                        <button className={`tab-btn ${viewMode === 'maintenance' ? 'active' : ''}`} onClick={() => setViewMode('maintenance')}>
                            <Users size={16} /> Student Maintenance
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-container">
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                        <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                        <p>Loading live data from database...</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'dashboard' && (
                            <>
                                {/* Live Stats Cards */}
                                <div className="admin-stats-row animate-fade-in">
                                    <div className="admin-stat-card">
                                        <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
                                            <Users size={24} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-value">{stats?.total_students ?? '—'}</span>
                                            <span className="stat-label">Total Students</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card">
                                        <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                                            <TrendingUp size={24} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-value">{stats?.avg_readiness ?? '—'}%</span>
                                            <span className="stat-label">Avg Readiness Score</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card">
                                        <div className="stat-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                                            <AlertCircle size={24} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-value">{stats?.at_risk_count ?? '—'}</span>
                                            <span className="stat-label">At-Risk Students (&lt;60%)</span>
                                        </div>
                                    </div>
                                    <div className="admin-stat-card">
                                        <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                                            <Award size={24} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-value">{stats?.top_gap_area ?? '—'}</span>
                                            <span className="stat-label">Top Gap Area</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Roster Table */}
                                <div className="students-table-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                    <div className="table-controls">
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                            Student Readiness Roster <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({filtered.length} of {students.length})</span>
                                        </div>
                                        <div className="filters-group">
                                            <select className="filter-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                                                <option value="">All Departments</option>
                                                <option value="CSE">CSE</option>
                                                <option value="IT">IT</option>
                                                <option value="ECE">ECE</option>
                                                <option value="MECH">MECH</option>
                                            </select>
                                            <select className="filter-select" value={scoreFilter} onChange={e => setScoreFilter(e.target.value)}>
                                                <option value="">All Score Ranges</option>
                                                <option value="high">&gt; 80% (Ready)</option>
                                                <option value="mid">60–80% (Improving)</option>
                                                <option value="low">&lt; 60% (At Risk)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="table-wrapper">
                                        <table className="students-table">
                                            <thead>
                                                <tr>
                                                    <th>Student Info</th>
                                                    <th>Roll / Dept</th>
                                                    <th>Readiness</th>
                                                    <th>Resume</th>
                                                    <th>Interview Avg</th>
                                                    <th>Tests</th>
                                                    <th>Primary Weakness</th>
                                                    <th>Last Active</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.length === 0 ? (
                                                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No students match the current filters.</td></tr>
                                                ) : filtered.map(s => (
                                                    <tr key={s.id}>
                                                        <td>
                                                            <div className="student-cell">
                                                                <div className="student-avatar">{getInitials(s.name)}</div>
                                                                <div className="student-details">
                                                                    <span className="student-name">{s.name}</span>
                                                                    <span className="student-email">{s.email}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><span className="badge" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>{s.roll} · {s.dept}</span></td>
                                                        <td><div className={`score-badge ${getScoreClass(s.readiness)}`}>{s.readiness}%</div></td>
                                                        <td><span style={{ fontWeight: 600, color: s.resume_score >= 70 ? 'var(--success)' : 'var(--danger)' }}>{s.resume_score}%</span></td>
                                                        <td><span style={{ fontWeight: 600 }}>{s.interview_avg}/10 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({s.interview_count})</span></span></td>
                                                        <td><span style={{ fontWeight: 600 }}>{s.test_avg}% <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({s.test_count})</span></span></td>
                                                        <td><span style={{ color: s.weakness === 'N/A' ? 'var(--text-muted)' : 'var(--danger)', fontWeight: 500 }}>{s.weakness}</span></td>
                                                        <td><span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.last_active}</span></td>
                                                        <td><button className="action-btn" onClick={() => handleInspect(s.roll)}>Inspect</button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {viewMode === 'maintenance' && (
                            <div className="maintenance-section animate-fade-in">
                                <div className="maintenance-card search-card">
                                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Lookup Student by Roll Number</h2>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label className="form-label">Roll Number (username)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 21CS001"
                                                value={rollInput}
                                                onChange={e => setRollInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                                style={{ paddingLeft: '1rem' }}
                                            />
                                        </div>
                                        <button className="btn-primary" onClick={handleSearch} disabled={!rollInput.trim() || isSearching}>
                                            {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                            {isSearching ? 'Searching...' : 'Fetch Student'}
                                        </button>
                                    </div>
                                    {searchError && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.85rem' }}>{searchError}</p>}
                                </div>

                                {searchedStudent && (
                                    <div className="maintenance-card result-card animate-fade-in">
                                        <div className="student-profile-header">
                                            <div className="student-avatar large">{getInitials(searchedStudent.name)}</div>
                                            <div className="student-header-info">
                                                <h2>{searchedStudent.name}</h2>
                                                <p>{searchedStudent.roll} · {searchedStudent.email}</p>
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>Active</span>
                                                </div>
                                            </div>
                                            <div className="student-overall-score">
                                                <div className="score-label">Readiness</div>
                                                <div className={`score-value ${getScoreClass(searchedStudent.readiness)}`}>{searchedStudent.readiness}%</div>
                                            </div>
                                        </div>

                                        <div className="student-metrics-grid">
                                            {[
                                                { label: 'Resume Score', value: `${searchedStudent.resume_score}%`, icon: <Award size={20} />, color: 'bg-emerald' },
                                                { label: 'Mock Interviews', value: `${searchedStudent.interview_count} sessions · avg ${searchedStudent.interview_avg}/10`, icon: <UserCheck size={20} />, color: 'bg-pink' },
                                                { label: 'Tests Taken', value: `${searchedStudent.test_count} tests · avg ${searchedStudent.test_avg}%`, icon: <BookOpen size={20} />, color: 'bg-indigo' },
                                                { label: 'Certifications', value: `${searchedStudent.certs_count} earned`, icon: <Award size={20} />, color: 'bg-emerald' },
                                            ].map(m => (
                                                <div key={m.label} className="metric-box">
                                                    <div className={`metric-icon ${m.color}`}>{m.icon}</div>
                                                    <div className="metric-data">
                                                        <div className="metric-title">{m.label}</div>
                                                        <div className="metric-number" style={{ fontSize: '1rem' }}>{m.value}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '10px' }}>
                                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Primary Weakness: </strong>
                                            <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{searchedStudent.weakness}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
