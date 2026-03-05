import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, BookOpen, Award, Eye } from 'lucide-react';
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
        if (rollQuery) filtered = filtered.filter(s => s.roll.toLowerCase().includes(rollQuery.toLowerCase()) || s.name.toLowerCase().includes(rollQuery.toLowerCase()));
        setResults(filtered);
        setSearched(true);
    };

    const getStatusClass = (status) => {
        if (status === 'Completed') return 'sm-status-green';
        if (status === 'Pending') return 'sm-status-yellow';
        return 'sm-status-red';
    };

    return (
        <div className="student-maintenance">
            <div className="sm-header">
                <h1 className="sm-title">Student Maintenance</h1>
                <p className="sm-sub">Search and manage individual student records by Year, Department, and Roll Number.</p>
            </div>

            {/* Search Card */}
            <div className="sm-search-card">
                <h3 className="sm-search-title"><Search size={18} /> Lookup Student</h3>
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
                        />
                    </div>
                </div>
                <button className="sm-search-btn" onClick={handleSearch}>
                    <Search size={16} /> Fetch Student Data
                </button>
            </div>

            {/* Results */}
            {searched && (
                <div className="sm-results-card animate-fade-in">
                    <div className="sm-results-header">
                        <span>{results.length} student{results.length !== 1 ? 's' : ''} found</span>
                    </div>
                    {results.length === 0 ? (
                        <p className="sm-no-results">No students match the selected criteria.</p>
                    ) : (
                        <div className="sm-cards-grid">
                            {results.map(student => (
                                <div key={student.id} className="sm-student-card">
                                    <div className="sm-student-header">
                                        <div className="sm-avatar">
                                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div className="sm-student-info">
                                            <div className="sm-student-name">{student.name}</div>
                                            <div className="sm-student-roll">{student.roll} • {student.dept} • {student.year}</div>
                                        </div>
                                    </div>

                                    <div className="sm-metrics">
                                        <div className="sm-metric">
                                            <BookOpen size={14} />
                                            <span className="sm-metric-label">Test</span>
                                            <span className="sm-metric-value">{student.testScore}%</span>
                                        </div>
                                        <div className="sm-metric">
                                            <Award size={14} />
                                            <span className="sm-metric-label">Resume</span>
                                            <span className="sm-metric-value">{student.resumeScore}%</span>
                                        </div>
                                        <div className="sm-metric">
                                            <UserCheck size={14} />
                                            <span className="sm-metric-label">Mocks</span>
                                            <span className="sm-metric-value">{student.mockInterviews}</span>
                                        </div>
                                    </div>

                                    <div className="sm-student-footer">
                                        <span className={`sm-status ${getStatusClass(student.interviewStatus)}`}>
                                            {student.interviewStatus}
                                        </span>
                                        <button
                                            className="sm-view-btn"
                                            onClick={() => navigate(`/admin/students/${student.id}`)}
                                        >
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
