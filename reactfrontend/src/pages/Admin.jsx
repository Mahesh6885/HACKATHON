import { useState } from 'react';
import { Users, TrendingUp, AlertCircle, Award, Filter, Download, UserCheck, BookOpen, Search } from 'lucide-react';
import './Admin.css';

export default function Admin() {
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'maintenance'

    // States for Student Maintenance
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedRoll, setSelectedRoll] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);

    const students = [
        { id: 101, roll: 'CSE-101', name: 'Alice Smith', email: 'alice@university.edu', dept: 'CSE', year: 'Final', score: 85, weakness: 'None', lastActive: '2 hrs ago', testsTaken: 12, mockInterviews: 2, resumeScore: 90 },
        { id: 102, roll: 'ECE-102', name: 'Bob Johnson', email: 'bob@university.edu', dept: 'ECE', year: 'Pre-Final', score: 68, weakness: 'Aptitude', lastActive: '1 day ago', testsTaken: 8, mockInterviews: 1, resumeScore: 70 },
        { id: 103, roll: 'CSE-103', name: 'Charlie Davis', email: 'charlie@university.edu', dept: 'CSE', year: 'Final', score: 42, weakness: 'Resume Quality', lastActive: '5 days ago', testsTaken: 4, mockInterviews: 0, resumeScore: 45 },
        { id: 104, roll: 'IT-104', name: 'Diana Clark', email: 'diana@university.edu', dept: 'IT', year: 'Final', score: 92, weakness: 'None', lastActive: '1 hr ago', testsTaken: 15, mockInterviews: 3, resumeScore: 95 },
        { id: 105, roll: 'MECH-105', name: 'Ethan Lewis', email: 'ethan@university.edu', dept: 'MECH', year: 'Pre-Final', score: 55, weakness: 'Mock Interviews', lastActive: '3 days ago', testsTaken: 6, mockInterviews: 0, resumeScore: 60 },
    ];

    const getScoreClass = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-med';
        return 'score-low';
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2);
    };

    const handleFetchStudent = () => {
        if (!selectedYear || !selectedDept || !selectedRoll) return;

        // Find mock student that somewhat matches the select criteria (for demo)
        // In real app, this would hit API with the specific roll number.
        const found = students.find(s => s.roll.toLowerCase().includes(selectedRoll.toLowerCase()) || s.dept === selectedDept);
        setSearchedStudent(found || { ...students[0], name: 'Mock Student Data', roll: selectedRoll, dept: selectedDept, year: selectedYear, score: 72 });
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Placement Admin Hub</h1>
                    <p className="page-subtitle">Batch analytics and student maintenance tools.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="admin-tabs">
                        <button
                            className={`tab-btn ${viewMode === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setViewMode('dashboard')}
                        >
                            <TrendingUp size={16} /> Dashboard
                        </button>
                        <button
                            className={`tab-btn ${viewMode === 'maintenance' ? 'active' : ''}`}
                            onClick={() => setViewMode('maintenance')}
                        >
                            <Users size={16} /> Student Maintenance
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-container">

                {viewMode === 'dashboard' && (
                    <>
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
                                        <option>MECH</option>
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
                                                    <button className="action-btn" onClick={() => {
                                                        setSelectedYear(student.year);
                                                        setSelectedDept(student.dept);
                                                        setSelectedRoll(student.roll);
                                                        fetchStudentDirect(student);
                                                    }}>Inspect</button>
                                                </td>
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
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Lookup Student</h2>

                            <div className="search-grid">
                                <div className="form-group">
                                    <label className="form-label">Year of Study</label>
                                    <select
                                        className="filter-select" style={{ width: '100%' }}
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="First">First Year</option>
                                        <option value="Second">Second Year</option>
                                        <option value="Pre-Final">Pre-Final Year</option>
                                        <option value="Final">Final Year</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <select
                                        className="filter-select" style={{ width: '100%' }}
                                        value={selectedDept}
                                        onChange={(e) => setSelectedDept(e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="IT">Information Tech (IT)</option>
                                        <option value="ECE">Electronics (ECE)</option>
                                        <option value="MECH">Mechanical (MECH)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Roll Number</label>
                                    <input
                                        type="text"
                                        className="input-with-icon"
                                        style={{ paddingLeft: '1rem' }}
                                        placeholder="Enter Roll No (e.g. CSE-101)"
                                        value={selectedRoll}
                                        onChange={(e) => setSelectedRoll(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn-primary"
                                style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
                                onClick={handleFetchStudent}
                                disabled={!selectedYear || !selectedDept || !selectedRoll}
                            >
                                <Search size={18} /> Fetch Student Data
                            </button>
                        </div>

                        {searchedStudent && (
                            <div className="maintenance-card result-card animate-fade-in">
                                <div className="student-profile-header">
                                    <div className="student-avatar large">{getInitials(searchedStudent.name)}</div>
                                    <div className="student-header-info">
                                        <h2>{searchedStudent.name}</h2>
                                        <p>{searchedStudent.roll} • {searchedStudent.dept} • {searchedStudent.year} Year</p>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <span className={`badge badge-success`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>Status: Active</span>
                                        </div>
                                    </div>

                                    <div className="student-overall-score">
                                        <div className="score-label">Overall Readiness</div>
                                        <div className={`score-value ${getScoreClass(searchedStudent.score)}`}>{searchedStudent.score}%</div>
                                    </div>
                                </div>

                                <div className="student-metrics-grid">
                                    <div className="metric-box">
                                        <div className="metric-icon bg-indigo"><BookOpen size={20} /></div>
                                        <div className="metric-data">
                                            <div className="metric-title">Tests Completed</div>
                                            <div className="metric-number">{searchedStudent.testsTaken}</div>
                                        </div>
                                    </div>
                                    <div className="metric-box">
                                        <div className="metric-icon bg-pink"><UserCheck size={20} /></div>
                                        <div className="metric-data">
                                            <div className="metric-title">Mock Interviews</div>
                                            <div className="metric-number">{searchedStudent.mockInterviews}</div>
                                        </div>
                                    </div>
                                    <div className="metric-box">
                                        <div className="metric-icon bg-emerald"><Award size={20} /></div>
                                        <div className="metric-data">
                                            <div className="metric-title">Resume Score</div>
                                            <div className="metric-number">{searchedStudent.resumeScore}/100</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="student-actions-bar">
                                    <button className="btn-secondary">Reset Password</button>
                                    <button className="btn-secondary">View Full Report</button>
                                    <button className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>Flag Account</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // Helpers function specific to demo quick-inspection
    function fetchStudentDirect(student) {
        setViewMode('maintenance');
        setSearchedStudent(student);
    }
}
