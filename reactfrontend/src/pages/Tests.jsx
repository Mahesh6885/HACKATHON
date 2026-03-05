import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Plus } from 'lucide-react';
import './Tests.css';

export default function Tests() {
    const chartData = [
        { name: 'Jan', score: 45 },
        { name: 'Feb', score: 52 },
        { name: 'Mar', score: 58 },
        { name: 'Apr', score: 65 },
        { name: 'May', score: 62 },
        { name: 'Jun', score: 75 },
        { name: 'Jul', score: 80 }
    ];

    const testHistory = [
        { id: 1, name: 'Cognizant GenC Next Aptitude', score: '80/100', date: 'Jul 15, 2026', type: 'Aptitude' },
        { id: 2, name: 'TCS Ninja Coding Round', score: '75/100', date: 'Jun 28, 2026', type: 'Coding' },
        { id: 3, name: 'Infosys Pseudo Code', score: '62/100', date: 'May 10, 2026', type: 'Domain' },
        { id: 4, name: 'Wipro English Comm Test', score: '85/100', date: 'Apr 22, 2026', type: 'Communication' },
        { id: 5, name: 'Accenture Tech Assessment', score: '58/100', date: 'Mar 15, 2026', type: 'Coding' },
    ];

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

                    <div className="chart-wrapper">
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
                            <span className="stat-value">65.2%</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Tests Taken</span>
                            <span className="stat-value">12</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Highest Score</span>
                            <span className="stat-value" style={{ color: 'var(--success)' }}>85%</span>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="history-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="section-title">Recent Tests</h2>

                    <div className="history-list">
                        {testHistory.map(test => (
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
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
