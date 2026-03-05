import { useState } from 'react';
import { User, Calendar, MessageSquare, Plus } from 'lucide-react';
import './Interviews.css';

export default function Interviews() {
    const [techRating, setTechRating] = useState(7);
    const [commRating, setCommRating] = useState(8);
    const [confRating, setConfRating] = useState(6);

    const history = [
        {
            id: 1,
            type: 'Technical Mock (SDE-1)',
            interviewer: 'Alumni Network - Jane Doe',
            date: 'Aug 12, 2026',
            tech: 8,
            comm: 7,
            conf: 8,
            feedback: "Strong grasp of algorithmic concepts, particularly dynamic programming. Communication was generally clear, but could improve pacing when explaining complex logic. Confident in approach."
        },
        {
            id: 2,
            type: 'HR Mock Interview',
            interviewer: 'Placement Cell - Mr. Smith',
            date: 'Jul 25, 2026',
            tech: 0, // N/A for HR
            comm: 9,
            conf: 7,
            feedback: "Excellent behavioral answers using the STAR method. Very professional demeanor. Work a bit more on the 'Tell me about a time you failed' question to sound more natural."
        }
    ];

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Mock Interviews</h1>
                    <p className="page-subtitle">Add self-evaluations or mentor ratings from your practice sessions.</p>
                </div>
                <button className="btn-secondary">
                    <Calendar size={18} /> Schedule Mock
                </button>
            </div>

            <div className="interviews-container">

                {/* Form Section */}
                <div className="feedback-form-section animate-fade-in">
                    <div className="form-header">
                        <h2 className="form-title">Log New Feedback</h2>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Interview Type / Company</label>
                        <input type="text" placeholder="e.g. Technical mock for Amazon" />
                    </div>

                    <div className="rating-container">
                        <div className="rating-group">
                            <div className="rating-label">
                                <span>Technical Skills</span>
                                <span className="rating-value">{techRating}/10</span>
                            </div>
                            <input
                                type="range" min="1" max="10"
                                value={techRating}
                                onChange={(e) => setTechRating(Number(e.target.value))}
                                className="slider"
                            />
                        </div>

                        <div className="rating-group">
                            <div className="rating-label">
                                <span>Communication</span>
                                <span className="rating-value">{commRating}/10</span>
                            </div>
                            <input
                                type="range" min="1" max="10"
                                value={commRating}
                                onChange={(e) => setCommRating(Number(e.target.value))}
                                className="slider"
                            />
                        </div>

                        <div className="rating-group">
                            <div className="rating-label">
                                <span>Confidence / Body Language</span>
                                <span className="rating-value">{confRating}/10</span>
                            </div>
                            <input
                                type="range" min="1" max="10"
                                value={confRating}
                                onChange={(e) => setConfRating(Number(e.target.value))}
                                className="slider"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Areas for Improvement & Notes</label>
                        <textarea className="note-input" placeholder="Type feedback notes here..."></textarea>
                    </div>

                    <button className="btn-primary" style={{ marginTop: 'auto' }}>
                        <Plus size={18} /> Save Feedback
                    </button>
                </div>

                {/* History Section */}
                <div className="history-section">
                    {history.map((item, index) => (
                        <div key={item.id} className="interview-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="card-top">
                                <div>
                                    <h3 className="company-title">{item.type}</h3>
                                    <div className="interviewer-name">
                                        <User size={14} /> {item.interviewer}
                                    </div>
                                </div>
                                <div className="date-badge">{item.date}</div>
                            </div>

                            <div className="scores-row">
                                {item.tech > 0 && (
                                    <div className="score-pill">
                                        <span className="pill-value">{item.tech}/10</span>
                                        <span className="pill-label">Technical</span>
                                    </div>
                                )}
                                <div className="score-pill">
                                    <span className="pill-value">{item.comm}/10</span>
                                    <span className="pill-label">Communication</span>
                                </div>
                                <div className="score-pill">
                                    <span className="pill-value">{item.conf}/10</span>
                                    <span className="pill-label">Confidence</span>
                                </div>
                            </div>

                            <div className="feedback-box">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                                    <MessageSquare size={14} /> Key Takeaways
                                </div>
                                <p className="feedback-text">"{item.feedback}"</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
