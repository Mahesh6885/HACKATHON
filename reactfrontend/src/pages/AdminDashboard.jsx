import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, TrendingUp, AlertCircle, Award, Download,
    Filter, Search, ChevronDown, Eye, Plus, FileSpreadsheet,
    Cpu, Settings, Zap, Database
} from 'lucide-react';
import './AdminDashboard.css';

const DEPT_CARDS = [
    { dept: 'CSE', label: 'Computer Science', icon: Cpu, color: '#eff6ff', iconColor: '#2563eb', border: '#bfdbfe', count: 3 },
    { dept: 'IT', label: 'Information Tech', icon: Database, color: '#f0fdf4', iconColor: '#16a34a', border: '#bbf7d0', count: 2 },
    { dept: 'ECE', label: 'Electronics', icon: Zap, color: '#fefce8', iconColor: '#ca8a04', border: '#fef08a', count: 2 },
    { dept: 'MECH', label: 'Mechanical', icon: Settings, color: '#fef2f2', iconColor: '#dc2626', border: '#fecaca', count: 1 },
];

const ALL_STUDENTS = [
    { id: 101, roll: 'CSE-101', name: 'Alice Smith', email: 'alice@uni.edu', dept: 'CSE', year: 'Final', cgpa: 9.1, resumeScore: 90, testScore: 85, interviewStatus: 'Completed', placed: true },
    { id: 102, roll: 'ECE-102', name: 'Bob Johnson', email: 'bob@uni.edu', dept: 'ECE', year: 'Pre-Final', cgpa: 7.4, resumeScore: 70, testScore: 62, interviewStatus: 'Pending', placed: false },
    { id: 103, roll: 'CSE-103', name: 'Charlie Davis', email: 'charlie@uni.edu', dept: 'CSE', year: 'Final', cgpa: 6.8, resumeScore: 45, testScore: 40, interviewStatus: 'Not Started', placed: false },
    { id: 104, roll: 'IT-104', name: 'Diana Clark', email: 'diana@uni.edu', dept: 'IT', year: 'Final', cgpa: 9.6, resumeScore: 95, testScore: 92, interviewStatus: 'Completed', placed: true },
    { id: 105, roll: 'MECH-105', name: 'Ethan Lewis', email: 'ethan@uni.edu', dept: 'MECH', year: 'Pre-Final', cgpa: 7.0, resumeScore: 60, testScore: 55, interviewStatus: 'Not Started', placed: false },
    { id: 106, roll: 'IT-106', name: 'Fatima Sheikh', email: 'fatima@uni.edu', dept: 'IT', year: 'Final', cgpa: 8.8, resumeScore: 82, testScore: 78, interviewStatus: 'Completed', placed: true },
    { id: 107, roll: 'ECE-107', name: 'George Nair', email: 'george@uni.edu', dept: 'ECE', year: 'Final', cgpa: 7.9, resumeScore: 65, testScore: 70, interviewStatus: 'Pending', placed: false },
    { id: 108, roll: 'CSE-108', name: 'Hannah Rao', email: 'hannah@uni.edu', dept: 'CSE', year: 'Pre-Final', cgpa: 8.2, resumeScore: 75, testScore: 80, interviewStatus: 'Pending', placed: false },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [scoreFilter, setScoreFilter] = useState('All');
    const [students, setStudents] = useState(ALL_STUDENTS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', roll: '', dept: 'CSE', year: 'Final', email: '', cgpa: '' });
    const [editId, setEditId] = useState(null);

    const placed = students.filter(s => s.placed).length;
    const avgReadiness = Math.round(students.reduce((a, s) => a + s.testScore, 0) / students.length);
    const atRisk = students.filter(s => s.testScore < 60).length;

    const filteredStudents = students.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.roll.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDept = deptFilter === 'All' || s.dept === deptFilter;
        const matchScore = scoreFilter === 'All' ||
            (scoreFilter === 'high' && s.testScore >= 80) ||
            (scoreFilter === 'mid' && s.testScore >= 60 && s.testScore < 80) ||
            (scoreFilter === 'low' && s.testScore < 60);
        return matchSearch && matchDept && matchScore;
    });

    const getStatusBadge = (status) => {
        if (status === 'Completed') return 'badge-green';
        if (status === 'Pending') return 'badge-yellow';
        return 'badge-red';
    };

    const handleDelete = (id) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    };

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.roll) return;
        setStudents(prev => [...prev, {
            ...newStudent,
            id: Date.now(),
            cgpa: parseFloat(newStudent.cgpa) || 7.0,
            resumeScore: 50,
            testScore: 50,
            interviewStatus: 'Not Started',
            placed: false
        }]);
        setNewStudent({ name: '', roll: '', dept: 'CSE', year: 'Final', email: '', cgpa: '' });
        setShowAddModal(false);
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Roll', 'Dept', 'Year', 'CGPA', 'Resume Score', 'Test Score', 'Interview Status'];
        const rows = filteredStudents.map(s =>
            [s.name, s.roll, s.dept, s.year, s.cgpa, s.resumeScore, s.testScore, s.interviewStatus].join(',')
        );
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'placement_students.csv';
        a.click();
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="admin-dashboard">
            {/* Page Header */}
            <div className="adash-header">
                <div>
                    <h1 className="adash-title">Placement Dashboard</h1>
                    <p className="adash-sub">Manage students, departments, and placement analytics</p>
                </div>
                <div className="adash-header-actions">
                    <label className="adash-import-btn">
                        <FileSpreadsheet size={16} />
                        Import from Excel
                        <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={() => alert('Excel import would connect to backend API')} />
                    </label>
                    <button className="adash-add-btn" onClick={() => setShowAddModal(true)}>
                        <Plus size={16} />
                        Add New Student
                    </button>
                    <button className="adash-export-btn" onClick={handleExportCSV}>
                        <Download size={15} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="adash-stats-grid">
                <div className="adash-stat-card">
                    <div className="adash-stat-icon blue-icon"><Users size={20} /></div>
                    <div><div className="adash-stat-value">{students.length}</div><div className="adash-stat-label">Total Students</div></div>
                </div>
                <div className="adash-stat-card">
                    <div className="adash-stat-icon green-icon"><TrendingUp size={20} /></div>
                    <div><div className="adash-stat-value">{avgReadiness}%</div><div className="adash-stat-label">Avg Readiness</div></div>
                </div>
                <div className="adash-stat-card">
                    <div className="adash-stat-icon indigo-icon"><Award size={20} /></div>
                    <div><div className="adash-stat-value">{placed} / {students.length - placed}</div><div className="adash-stat-label">Placed / Unplaced</div></div>
                </div>
                <div className="adash-stat-card">
                    <div className="adash-stat-icon red-icon"><AlertCircle size={20} /></div>
                    <div><div className="adash-stat-value">{atRisk}</div><div className="adash-stat-label">At-Risk Students</div></div>
                </div>
            </div>

            {/* Department Cards */}
            <div>
                <h2 className="adash-section-title">Departments</h2>
                <div className="adash-dept-grid">
                    {DEPT_CARDS.map(d => {
                        const Icon = d.icon;
                        const count = students.filter(s => s.dept === d.dept).length;
                        return (
                            <div
                                key={d.dept}
                                className="adash-dept-card"
                                style={{ background: d.color, borderColor: d.border }}
                                onClick={() => setDeptFilter(d.dept)}
                            >
                                <div className="adash-dept-icon" style={{ background: d.iconColor }}>
                                    <Icon size={20} color="white" />
                                </div>
                                <div className="adash-dept-info">
                                    <div className="adash-dept-name">{d.dept}</div>
                                    <div className="adash-dept-label">{d.label}</div>
                                    <div className="adash-dept-count">{count} students</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Student Cards */}
            <div className="adash-table-card">
                <div className="adash-table-controls">
                    <div className="adash-table-title">
                        Student List
                        {deptFilter !== 'All' && (
                            <span className="adash-active-filter">
                                {deptFilter}
                                <button onClick={() => setDeptFilter('All')}>×</button>
                            </span>
                        )}
                    </div>
                    <div className="adash-table-filters">
                        <div className="adash-search">
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="Search name or roll..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="adash-filter-wrap">
                            <Filter size={13} />
                            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                                <option value="All">All Depts</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                            </select>
                        </div>
                        <div className="adash-filter-wrap">
                            <select value={scoreFilter} onChange={e => setScoreFilter(e.target.value)}>
                                <option value="All">All Scores</option>
                                <option value="high">Ready (&gt;80%)</option>
                                <option value="mid">Improving (60–80%)</option>
                                <option value="low">At-Risk (&lt;60%)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Student Cards List */}
                <div className="adash-student-list">
                    {filteredStudents.length === 0 && (
                        <div className="adash-empty">No students match your filters.</div>
                    )}
                    {filteredStudents.map(student => (
                        <div key={student.id} className="adash-student-row">
                            <div className="adash-student-thumb">{getInitials(student.name)}</div>
                            <div className="adash-student-details">
                                <span className="adash-sname">{student.name}</span>
                                <span className="adash-sroll">{student.roll} · {student.dept} · {student.year} · CGPA {student.cgpa}</span>
                            </div>
                            <div className="adash-student-mid">
                                <span className={`adash-badge ${getStatusBadge(student.interviewStatus)}`}>
                                    {student.interviewStatus}
                                </span>
                                <span className="adash-score-chip">Test: {student.testScore}%</span>
                            </div>
                            <div className="adash-row-actions">
                                <button className="adash-edit-btn" onClick={() => navigate(`/admin/students/${student.id}`)}>
                                    <Eye size={14} /> View
                                </button>
                                <button className="adash-delete-btn" onClick={() => handleDelete(student.id)}>
                                    ✕ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="adash-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="adash-modal" onClick={e => e.stopPropagation()}>
                        <div className="adash-modal-header">
                            <h3>Add New Student</h3>
                            <button onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="adash-modal-body">
                            <div className="adash-modal-grid">
                                <div className="adash-modal-field">
                                    <label>Full Name*</label>
                                    <input placeholder="e.g. John Doe" value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className="adash-modal-field">
                                    <label>Roll Number*</label>
                                    <input placeholder="e.g. CSE-120" value={newStudent.roll} onChange={e => setNewStudent(p => ({ ...p, roll: e.target.value }))} />
                                </div>
                                <div className="adash-modal-field">
                                    <label>Email</label>
                                    <input type="email" placeholder="john@uni.edu" value={newStudent.email} onChange={e => setNewStudent(p => ({ ...p, email: e.target.value }))} />
                                </div>
                                <div className="adash-modal-field">
                                    <label>CGPA</label>
                                    <input type="number" step="0.1" min="0" max="10" placeholder="8.5" value={newStudent.cgpa} onChange={e => setNewStudent(p => ({ ...p, cgpa: e.target.value }))} />
                                </div>
                                <div className="adash-modal-field">
                                    <label>Department</label>
                                    <select value={newStudent.dept} onChange={e => setNewStudent(p => ({ ...p, dept: e.target.value }))}>
                                        <option>CSE</option><option>IT</option><option>ECE</option><option>MECH</option>
                                    </select>
                                </div>
                                <div className="adash-modal-field">
                                    <label>Year</label>
                                    <select value={newStudent.year} onChange={e => setNewStudent(p => ({ ...p, year: e.target.value }))}>
                                        <option>First</option><option>Second</option><option>Pre-Final</option><option>Final</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="adash-modal-footer">
                            <button className="adash-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="adash-modal-save" onClick={handleAddStudent}>Add Student</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
