import { useState } from 'react';
import { Users, TrendingUp, AlertCircle, Award, Filter, Download } from 'lucide-react';
import './Admin.css';

export default function Admin() {
    const students = [
        { id: 101, name: 'Alice Smith', email: 'alice@university.edu', dept: 'CSE', year: 'Final', score: 85, weakness: 'None', lastActive: '2 hrs ago' },
        { id: 102, name: 'Bob Johnson', email: 'bob@university.edu', dept: 'ECE', year: 'Pre-Final', score: 68, weakness: 'Aptitude', lastActive: '1 day ago' },
        { id: 103, name: 'Charlie Davis', email: 'charlie@university.edu', dept: 'CSE', year: 'Final', score: 42, weakness: 'Resume Quality', lastActive: '5 days ago' },
        { id: 104, name: 'Diana Clark', email: 'diana@university.edu', dept: 'IT', year: 'Final', score: 92, weakness: 'None', lastActive: '1 hr ago' },
        { id: 105, name: 'Ethan Lewis', email: 'ethan@university.edu', dept: 'Mech', year: 'Pre-Final', score: 55, weakness: 'Mock Interviews', lastActive: '3 days ago' },
    ];

    const getScoreClass = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-med';
        return 'score-low';
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Placement Admin Dashboard</h1>
                    <p className="page-subtitle">Batch analytics and student readiness overview.</p>
                </div>
                <button className="btn-secondary">
                    <Download size={18} /> Export Report
                </button>
            </div>

            <div className="admin-container">

                {/* Top Analytics Cards */}
                <div className="admin-stats-row animate-fade-in">
                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
                            <Users size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">842</span>
                            <span className="stat-label">Total Students</span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">68%</span>
                            <span className="stat-label">Avg Readiness Score</span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">124</span>
                            <span className="stat-label">At-Risk Students</span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                            <Award size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">Resume</span>
                            <span className="stat-label">Top Gap Area</span>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="students-table-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="table-controls">
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Student Readiness Roster</div>

                        <div className="filters-group">
                            <select className="filter-select">
                                <option>All Departments</option>
                                <option>CSE</option>
                                <option>IT</option>
                                <option>ECE</option>
                            </select>
                            <select className="filter-select">
                                <option>All Score Ranges</option>
                                <option>&gt; 80% (Ready)</option>
                                <option>60 - 80% (Improving)</option>
                                <option>&lt; 60% (At Risk)</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>Student Info</th>
                                    <th>Department</th>
                                    <th>Readiness Score</th>
                                    <th>Primary Weakness</th>
                                    <th>Last Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="student-cell">
                                                <div className="student-avatar">{getInitials(student.name)}</div>
                                                <div className="student-details">
                                                    <span className="student-name">{student.name}</span>
                                                    <span className="student-email">{student.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                                                {student.dept} - {student.year}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={`score-badge ${getScoreClass(student.score)}`}>
                                                {student.score}%
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ color: student.weakness === 'None' ? 'var(--text-muted)' : 'var(--danger)', fontWeight: 500, fontSize: '0.9rem' }}>
                                                {student.weakness}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                {student.lastActive}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn">View Profile</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
