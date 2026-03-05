import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, BookOpen, Award, Eye, Filter } from 'lucide-react';
import './StudentMaintenance.css';

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

export default function StudentMaintenance() {
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [rollQuery, setRollQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        let filtered = ALL_STUDENTS;
        if (selectedYear) filtered = filtered.filter(s => s.year === selectedYear);
        if (selectedDept) filtered = filtered.filter(s => s.dept === selectedDept);
        if (rollQuery) filtered = filtered.filter(s =>
            s.roll.toLowerCase().includes(rollQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(rollQuery.toLowerCase())
        );
        setResults(filtered);
        setSearched(true);
    };

    const getStatusClass = (status) => {
        if (status === 'Completed') return 'sm-status-green';
        if (status === 'Pending') return 'sm-status-yellow';
        return 'sm-status-red';
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="student-maintenance">
            <div className="sm-header">
                <h1 className="sm-title">Student Maintenance</h1>
                <p className="sm-sub">Look up and manage individual student records by Year, Department, and Roll Number.</p>
            </div>

            {/* Search Card */}
            <div className="sm-search-card">
                <div className="sm-card-header">
                    <Filter size={18} />
                    <h3>Filter Students</h3>
                </div>
                <div className="sm-search-grid">
                    <div className="sm-form-group">
                        <label>Year of Study</label>
                        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                            <option value="">All Years</option>
                            <option value="First">First Year</option>
                            <option value="Second">Second Year</option>
                            <option value="Pre-Final">Pre-Final Year</option>
                            <option value="Final">Final Year</option>
                        </select>
                    </div>
                    <div className="sm-form-group">
                        <label>Department</label>
                        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                            <option value="">All Departments</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="MECH">MECH</option>
                        </select>
                    </div>
                    <div className="sm-form-group">
                        <label>Roll No. / Name</label>
                        <input
                            type="text"
                            placeholder="e.g. CSE-101 or Alice"
                            value={rollQuery}
                            onChange={e => setRollQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                </div>
                <button className="sm-search-btn" onClick={handleSearch}>
                    <Search size={15} /> Fetch Students
                </button>
            </div>

            {/* Results */}
            {searched && (
                <div className="sm-results-card">
                    <div className="sm-results-header">
                        <span className="sm-results-count">{results.length} student{results.length !== 1 ? 's' : ''} found</span>
                    </div>
                    {results.length === 0 ? (
                        <p className="sm-no-results">No students match the selected criteria.</p>
                    ) : (
                        <div className="sm-student-list">
                            {results.map(student => (
                                <div key={student.id} className="sm-student-row">
                                    <div className="sm-student-thumb">{getInitials(student.name)}</div>
                                    <div className="sm-student-info">
                                        <span className="sm-sname">{student.name}</span>
                                        <span className="sm-sroll">{student.roll} · {student.dept} · {student.year} Year · CGPA {student.cgpa}</span>
                                    </div>
                                    <div className="sm-student-stats">
                                        <div className="sm-stat-chip"><BookOpen size={12} /> Test: {student.testScore}%</div>
                                        <div className="sm-stat-chip"><Award size={12} /> Resume: {student.resumeScore}%</div>
                                        <div className="sm-stat-chip"><UserCheck size={12} /> Mocks: {student.mockInterviews}</div>
                                    </div>
                                    <div className="sm-student-mid">
                                        <span className={`sm-badge ${getStatusClass(student.interviewStatus)}`}>{student.interviewStatus}</span>
                                    </div>
                                    <div className="sm-row-actions">
                                        <button className="sm-view-btn" onClick={() => navigate(`/admin/students/${student.id}`)}>
                                            <Eye size={14} /> View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
