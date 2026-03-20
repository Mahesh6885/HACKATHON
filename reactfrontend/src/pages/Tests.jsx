import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Plus, RefreshCw, BarChart2 } from 'lucide-react';
import './Tests.css';

export default function Tests() {
    const [testHistory, setTestHistory] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem('access_token');
        fetch('http://localhost:8000/api/tests/', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const formatted = data.map(item => ({
                        id: item.id,
                        name: item.test_name,
                        score: `${item.score}/${item.total}`,
                        date: new Date(item.taken_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        type: item.type,
                        rawScore: (item.score / item.total) * 100,
                        dateObj: new Date(item.taken_at)
                    }));
                    setTestHistory(formatted);

                    // Chart data needs to be chronological (oldest to newest)
                    const chronological = [...formatted].sort((a, b) => a.dateObj - b.dateObj);
                    const cData = chronological.map(item => ({
                        name: item.date.slice(0, 6),
                        score: Math.round(item.rawScore)
                    }));

                    // If no data, provide a flatline so chart doesn't break
                    if (cData.length === 0) {
                        setChartData([{ name: 'Today', score: 0 }]);
                    } else {
                        setChartData(cData);
                    }
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch test scores:", err);
                setIsLoading(false);
            });
    }, []);

    const avgScore = testHistory.length > 0
        ? Math.round(testHistory.reduce((acc, curr) => acc + curr.rawScore, 0) / testHistory.length)
        : 0;
    const highestScore = testHistory.length > 0
        ? Math.round(Math.max(...testHistory.map(t => t.rawScore)))
        : 0;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Test Scores</h1>
                    <p className="page-subtitle">Track your aptitude, coding, and domain test performances.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Add Score
                </button>
            </div>

            <div className="tests-container">

                {/* Chart Section */}
                <div className="chart-section animate-fade-in">
                    <div className="section-header">
                        <h2 className="section-title">Performance Trend</h2>
                    </div>

                    <div className="chart-wrapper" style={{ minHeight: '300px', height: '100%', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Average Score</span>
                            <span className="stat-value">{isLoading ? '-' : `${avgScore}%`}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Tests Taken</span>
                            <span className="stat-value">{isLoading ? '-' : testHistory.length}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Highest Score</span>
                            <span className="stat-value" style={{ color: 'var(--success)' }}>{isLoading ? '-' : `${highestScore}%`}</span>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="history-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="section-title">Recent Tests</h2>

                    <div className="history-list">
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                                Loading test records...
                            </div>
                        ) : testHistory.length > 0 ? (
                            testHistory.map(test => (
                                <div key={test.id} className="history-item">
                                    <div className="item-row">
                                        <div className="test-name">{test.name}</div>
                                        <div className="test-score">{test.score}</div>
                                    </div>
                                    <div className="item-row">
                                        <span className="test-type">{test.type}</span>
                                        <div className="test-date">{test.date}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                                <BarChart2 size={32} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Tests Taken</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>You haven't recorded any test scores yet.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
