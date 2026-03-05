import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Mail, BookOpen, FileText, MessageSquare,
    Award, TrendingUp, Save, User
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import './StudentProfile.css';

const ALL_STUDENTS = [
    { id: 101, roll: 'CSE-101', name: 'Alice Smith', email: 'alice@uni.edu', dept: 'CSE', year: 'Final', cgpa: 9.1, resumeScore: 90, testScore: 85, interviewStatus: 'Completed', placed: true, mockInterviews: 2, technical: 90, communication: 78, aptitude: 82, leadership: 70, problemSolving: 88 },
    { id: 102, roll: 'ECE-102', name: 'Bob Johnson', email: 'bob@uni.edu', dept: 'ECE', year: 'Pre-Final', cgpa: 7.4, resumeScore: 70, testScore: 62, interviewStatus: 'Pending', placed: false, mockInterviews: 1, technical: 65, communication: 72, aptitude: 60, leadership: 55, problemSolving: 68 },
    { id: 103, roll: 'CSE-103', name: 'Charlie Davis', email: 'charlie@uni.edu', dept: 'CSE', year: 'Final', cgpa: 6.8, resumeScore: 45, testScore: 40, interviewStatus: 'Not Started', placed: false, mockInterviews: 0, technical: 42, communication: 50, aptitude: 38, leadership: 40, problemSolving: 45 },
    { id: 104, roll: 'IT-104', name: 'Diana Clark', email: 'diana@uni.edu', dept: 'IT', year: 'Final', cgpa: 9.6, resumeScore: 95, testScore: 92, interviewStatus: 'Completed', placed: true, mockInterviews: 3, technical: 95, communication: 88, aptitude: 90, leadership: 85, problemSolving: 92 },
    { id: 105, roll: 'MECH-105', name: 'Ethan Lewis', email: 'ethan@uni.edu', dept: 'MECH', year: 'Pre-Final', cgpa: 7.0, resumeScore: 60, testScore: 55, interviewStatus: 'Not Started', placed: false, mockInterviews: 0, technical: 55, communication: 60, aptitude: 52, leadership: 48, problemSolving: 58 },
    { id: 106, roll: 'IT-106', name: 'Fatima Sheikh', email: 'fatima@uni.edu', dept: 'IT', year: 'Final', cgpa: 8.8, resumeScore: 82, testScore: 78, interviewStatus: 'Completed', placed: true, mockInterviews: 2, technical: 80, communication: 85, aptitude: 75, leadership: 72, problemSolving: 78 },
    { id: 107, roll: 'ECE-107', name: 'George Nair', email: 'george@uni.edu', dept: 'ECE', year: 'Final', cgpa: 7.9, resumeScore: 65, testScore: 70, interviewStatus: 'Pending', placed: false, mockInterviews: 1, technical: 70, communication: 65, aptitude: 68, leadership: 60, problemSolving: 72 },
    { id: 108, roll: 'CSE-108', name: 'Hannah Rao', email: 'hannah@uni.edu', dept: 'CSE', year: 'Pre-Final', cgpa: 8.2, resumeScore: 75, testScore: 80, interviewStatus: 'Pending', placed: false, mockInterviews: 1, technical: 78, communication: 70, aptitude: 82, leadership: 65, problemSolving: 76 },
];

export default function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [adminNote, setAdminNote] = useState('');
    const [noteSaved, setNoteSaved] = useState(false);

    const student = ALL_STUDENTS.find(s => s.id === parseInt(id));

    if (!student) {
        return (
            <div className="sp-not-found">
                <p>Student not found.</p>
                <button onClick={() => navigate('/admin/students')} className="sp-back-btn">
                    <ArrowLeft size={16} /> Back
                </button>
            </div>
        );
    }

    const radarData = [
        { skill: 'Technical', value: student.technical },
        { skill: 'Communication', value: student.communication },
        { skill: 'Aptitude', value: student.aptitude },
        { skill: 'Leadership', value: student.leadership },
        { skill: 'Problem Solving', value: student.problemSolving },
    ];

    const getStatusClass = (status) => {
        if (status === 'Completed') return 'sps-completed';
        if (status === 'Pending') return 'sps-pending';
        return 'sps-not-started';
    };

    const handleSaveNote = () => {
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2500);
    };

    const overallScore = Math.round(
        (student.resumeScore + student.testScore) / 2
    );

    return (
        <div className="student-profile">
            {/* Back Button */}
            <button className="sp-back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            {/* Profile Header */}
            <div className="sp-header-card">
                <div className="sp-avatar-large">
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="sp-header-info">
                    <h1 className="sp-name">{student.name}</h1>
                    <div className="sp-meta">
                        <span><User size={14} /> {student.roll}</span>
                        <span><Mail size={14} /> {student.email}</span>
                    </div>
                    <div className="sp-tags">
                        <span className="sp-tag">{student.dept}</span>
                        <span className="sp-tag">{student.year} Year</span>
                        <span className="sp-tag">CGPA: {student.cgpa}</span>
                        <span className={`adash-status-badge ${getStatusClass(student.interviewStatus)}`}>
                            {student.interviewStatus}
                        </span>
                    </div>
                </div>
                <div className="sp-overall-score">
                    <div className="sp-score-ring" style={{
                        background: `conic-gradient(${overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#f87171'} ${overallScore * 3.6}deg, rgba(255,255,255,0.06) 0deg)`
                    }}>
                        <div className="sp-score-inner">
                            <span className="sp-score-number">{overallScore}%</span>
                            <span className="sp-score-label">Readiness</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="sp-grid">
                {/* Radar Chart */}
                <div className="sp-card sp-radar-card">
                    <div className="sp-card-header">
                        <TrendingUp size={18} />
                        <h3>Skill Gap Analysis</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Radar
                                name="Skills"
                                dataKey="value"
                                stroke="#06b6d4"
                                fill="rgba(6, 182, 212, 0.15)"
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Score Breakdown */}
                <div className="sp-card sp-scores-card">
                    <div className="sp-card-header">
                        <Award size={18} />
                        <h3>Score Breakdown</h3>
                    </div>
                    <div className="sp-score-items">
                        <div className="sp-score-item">
                            <div className="sp-score-item-header">
                                <span><FileText size={14} /> Resume Score</span>
                                <span className="sp-score-val">{student.resumeScore}%</span>
                            </div>
                            <div className="sp-progress-bar">
                                <div className="sp-progress-fill green" style={{ width: `${student.resumeScore}%` }}></div>
                            </div>
                        </div>
                        <div className="sp-score-item">
                            <div className="sp-score-item-header">
                                <span><BookOpen size={14} /> Test Score</span>
                                <span className="sp-score-val">{student.testScore}%</span>
                            </div>
                            <div className="sp-progress-bar">
                                <div className="sp-progress-fill cyan" style={{ width: `${student.testScore}%` }}></div>
                            </div>
                        </div>
                        <div className="sp-score-item">
                            <div className="sp-score-item-header">
                                <span><MessageSquare size={14} /> Mock Interviews</span>
                                <span className="sp-score-val">{student.mockInterviews} done</span>
                            </div>
                            <div className="sp-progress-bar">
                                <div className="sp-progress-fill purple" style={{ width: `${Math.min(student.mockInterviews * 33, 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="sp-divider"></div>

                        <div className="sp-placed-row">
                            <span>Placement Status</span>
                            <span className={student.placed ? 'sp-placed' : 'sp-unplaced'}>
                                {student.placed ? '✓ Placed' : '✗ Not Placed'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Admin Notes */}
                <div className="sp-card sp-notes-card">
                    <div className="sp-card-header">
                        <FileText size={18} />
                        <h3>Placement Officer Notes</h3>
                    </div>
                    <p className="sp-notes-hint">These notes will be visible to the student on their dashboard.</p>
                    <textarea
                        className="sp-notes-textarea"
                        placeholder={`Write feedback for ${student.name}...`}
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        rows={5}
                    />
                    <button className="sp-save-btn" onClick={handleSaveNote}>
                        <Save size={15} />
                        {noteSaved ? '✓ Saved!' : 'Save Note'}
                    </button>
                </div>
            </div>
        </div>
    );
}
