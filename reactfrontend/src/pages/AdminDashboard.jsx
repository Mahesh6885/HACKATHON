import { Users, TrendingUp, AlertCircle, Award } from 'lucide-react';
import './AdminDashboard.css';

const ALL_STUDENTS = [
    { id: 101, testScore: 85, placed: true },
    { id: 102, testScore: 62, placed: false },
    { id: 103, testScore: 40, placed: false },
    { id: 104, testScore: 92, placed: true },
    { id: 105, testScore: 55, placed: false },
    { id: 106, testScore: 78, placed: true },
    { id: 107, testScore: 70, placed: false },
    { id: 108, testScore: 80, placed: false },
];

export default function AdminDashboard() {
    const total = ALL_STUDENTS.length;
    const placed = ALL_STUDENTS.filter(s => s.placed).length;
    const unplaced = total - placed;
    const atRisk = ALL_STUDENTS.filter(s => s.testScore < 60).length;
    const avgReadiness = Math.round(ALL_STUDENTS.reduce((a, s) => a + s.testScore, 0) / total);

    const stats = [
        { label: 'Total Students', value: total, icon: Users, cls: 'blue-icon', desc: 'Students enrolled across all departments' },
        { label: 'Placed Students', value: placed, icon: Award, cls: 'green-icon', desc: 'Successfully placed in companies' },
        { label: 'Unplaced Students', value: unplaced, icon: AlertCircle, cls: 'red-icon', desc: 'Yet to be placed' },
        { label: 'Avg Readiness', value: `${avgReadiness}%`, icon: TrendingUp, cls: 'indigo-icon', desc: 'Average test score across batch' },
    ];

    return (
        <div className="admin-dashboard">
            <div className="adash-header">
                <div>
                    <h1 className="adash-title">Overview</h1>
                    <p className="adash-sub">General placement readiness summary for the current batch</p>
                </div>
            </div>

            <div className="adash-stats-grid">
                {stats.map(({ label, value, icon: Icon, cls, desc }) => (
                    <div key={label} className="adash-stat-card">
                        <div className={`adash-stat-icon ${cls}`}><Icon size={22} /></div>
                        <div>
                            <div className="adash-stat-value">{value}</div>
                            <div className="adash-stat-label">{label}</div>
                            <div className="adash-stat-desc">{desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
