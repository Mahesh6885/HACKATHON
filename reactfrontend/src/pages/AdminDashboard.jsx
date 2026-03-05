import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, TrendingUp, AlertCircle, Award, Download, Filter,
    Search, ChevronDown, Eye
} from 'lucide-react';
import './AdminDashboard.css';

const ALL_STUDENTS = [
    { id: 101, roll: 'CSE-101', name: 'Alice Smith', email: 'alice@uni.edu', dept: 'CSE', year: 'Final', cgpa: 9.1, resumeScore: 90, testScore: 85, interviewStatus: 'Completed', placed: true, mockInterviews: 2 },
    { id: 102, roll: 'ECE-102', name: 'Bob Johnson', email: 'bob@uni.edu', dept: 'ECE', year: 'Pre-Final', cgpa: 7.4, resumeScore: 70, testScore: 62, interviewStatus: 'Pending', placed: false, mockInterviews: 1 },
    { id: 103, roll: 'CSE-103', name: 'Charlie Davis', email: 'charlie@uni.edu', dept: 'CSE', year: 'Final', cgpa: 6.8, resumeScore: 45, testScore: 40, interviewStatus: 'Not Started', placed: false, mockInterviews: 0 },
    { id: 104, roll: 'IT-104', name: 'Diana Clark', email: 'diana@uni.edu', dept: 'IT', year: 'Final', cgpa: 9.6, resumeScore: 95, testScore: 92, interviewStatus: 'Completed', placed: true, mockInterviews: 3 },
    { id: 105, roll: 'MECH-105', name: 'Ethan Lewis', email: 'ethan@uni.edu', dept: 'MECH', year: 'Pre-Final', cgpa: 7.0, resumeScore: 60, testScore: 55, interviewStatus: 'Not Started', placed: false, mockInterviews: 0 },
    { id: 106, roll: 'IT-106', name: 'Fatima Sheikh', email: 'fatima@uni.edu', dept: 'IT', year: 'Final', cgpa: 8.8, resumeScore: 82, testScore: 78, interviewStatus: 'Completed', placed: true, mockInterviews: 2 },
    { id: 107, roll: 'ECE-107', name: 'George Nair', email: 'george@uni.edu', dept: 'ECE', year: 'Final', cgpa: 7.9, resumeScore: 65, testScore: 70, interviewStatus: 'Pending', placed: false, mockInterviews: 1 },
    { id: 108, roll: 'CSE-108', name: 'Hannah Rao', email: 'hannah@uni.edu', dept: 'CSE', year: 'Pre-Final', cgpa: 8.2, resumeScore: 75, testScore: 80, interviewStatus: 'Pending', placed: false, mockInterviews: 1 },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [scoreFilter, setScoreFilter] = useState('All');

    const placed = ALL_STUDENTS.filter(s => s.placed).length;
    const avgReadiness = Math.round(ALL_STUDENTS.reduce((a, s) => a + s.testScore, 0) / ALL_STUDENTS.length);
    const atRisk = ALL_STUDENTS.filter(s => s.testScore < 60).length;

    const filteredStudents = ALL_STUDENTS.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDept = deptFilter === 'All' || s.dept === deptFilter;
        const matchScore = scoreFilter === 'All' ||
            (scoreFilter === 'high' && s.testScore >= 80) ||
            (scoreFilter === 'mid' && s.testScore >= 60 && s.testScore < 80) ||
            (scoreFilter === 'low' && s.testScore < 60);
        return matchSearch && matchDept && matchScore;
    });

    const getStatusBadge = (status) => {
        if (status === 'Completed') return 'status-completed';
        if (status === 'Pending') return 'status-pending';
        return 'status-not-started';
    };

    const getScoreGlow = (score) => {
        if (score >= 80) return 'score-glow-green';
        if (score >= 60) return 'score-glow-yellow';
        return 'score-glow-red';
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Dept', 'CGPA', 'Resume Score', 'Test Score', 'Interview Status'];
        const rows = filteredStudents.map(s =>
            [s.name, s.dept, s.cgpa, s.resumeScore, s.testScore, s.interviewStatus].join(',')
        );
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'students_export.csv'; a.click();
    };

    return (
        <div className="admin-dashboard">
            {/* Page Header */}
            <div className="adash-header">
                <div>
                    <h1 className="adash-title">Placement Dashboard</h1>
                    <p className="adash-sub">Batch overview and student readiness analytics</p>
                </div>
                <button className="adash-export-btn" onClick={handleExportCSV}>
                    <Download size={16} /> Export CSV
                </button>
            </div>

            {/* Stats Cards */}
            <div className="adash-stats-grid">
                <div className="adash-stat-card cyan">
                    <div className="adash-stat-icon"><Users size={22} /></div>
                    <div className="adash-stat-info">
                        <span className="adash-stat-value">{ALL_STUDENTS.length}</span>
                        <span className="adash-stat-label">Total Students</span>
                    </div>
                    <div className="adash-stat-glow"></div>
                </div>
                <div className="adash-stat-card green">
                    <div className="adash-stat-icon"><TrendingUp size={22} /></div>
                    <div className="adash-stat-info">
                        <span className="adash-stat-value">{avgReadiness}%</span>
                        <span className="adash-stat-label">Avg Readiness</span>
                    </div>
                    <div className="adash-stat-glow"></div>
                </div>
                <div className="adash-stat-card blue">
                    <div className="adash-stat-icon"><Award size={22} /></div>
                    <div className="adash-stat-info">
                        <span className="adash-stat-value">{placed} / {ALL_STUDENTS.length - placed}</span>
                        <span className="adash-stat-label">Placed vs Unplaced</span>
                    </div>
                    <div className="adash-stat-glow"></div>
                </div>
                <div className="adash-stat-card red">
                    <div className="adash-stat-icon"><AlertCircle size={22} /></div>
                    <div className="adash-stat-info">
                        <span className="adash-stat-value">{atRisk}</span>
                        <span className="adash-stat-label">At-Risk Students</span>
                    </div>
                    <div className="adash-stat-glow"></div>
                </div>
            </div>

            {/* Table Section */}
            <div className="adash-table-card">
                {/* Table Controls */}
                <div className="adash-table-controls">
                    <div className="adash-table-title">Student Master Table</div>
                    <div className="adash-table-filters">
                        <div className="adash-search">
                            <Search size={15} />
                            <input
                                type="text"
                                placeholder="Search name, roll, email..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="adash-filter-select-wrapper">
                            <Filter size={14} />
                            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                                <option value="All">All Depts</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                            </select>
                            <ChevronDown size={14} />
                        </div>
                        <div className="adash-filter-select-wrapper">
                            <Filter size={14} />
                            <select value={scoreFilter} onChange={e => setScoreFilter(e.target.value)}>
                                <option value="All">All Scores</option>
                                <option value="high">&gt; 80% Ready</option>
                                <option value="mid">60–80% Improving</option>
                                <option value="low">&lt; 60% At Risk</option>
                            </select>
                            <ChevronDown size={14} />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="adash-table-wrapper">
                    <table className="adash-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Dept</th>
                                <th>CGPA</th>
                                <th>Resume Score</th>
                                <th>Test Score</th>
                                <th>Interview Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td>
                                        <div className="adash-student-cell">
                                            <div className="adash-student-avatar">
                                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="adash-student-name">{student.name}</div>
                                                <div className="adash-student-email">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="adash-dept-badge">{student.dept}</span>
                                    </td>
                                    <td>
                                        <span className="adash-cgpa">{student.cgpa}</span>
                                    </td>
                                    <td>
                                        <div className={`adash-score-pill ${getScoreGlow(student.resumeScore)}`}>
                                            {student.resumeScore}%
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`adash-score-pill ${getScoreGlow(student.testScore)}`}>
                                            {student.testScore}%
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`adash-status-badge ${getStatusBadge(student.interviewStatus)}`}>
                                            {student.interviewStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="adash-view-btn"
                                            onClick={() => navigate(`/admin/students/${student.id}`)}
                                        >
                                            <Eye size={15} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="adash-empty">No students match your filters.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
