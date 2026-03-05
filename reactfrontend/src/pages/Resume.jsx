import { useState } from 'react';
import {
    UploadCloud,
    CheckCircle,
    AlertTriangle,
    XCircle,
    File,
    RefreshCw
} from 'lucide-react';
import './Resume.css';

export default function Resume() {
    const [isUploading, setIsUploading] = useState(false);
    const [hasAnalysis, setHasAnalysis] = useState(true); // For demo, default to showing analysis

    const handleUpload = () => {
        setIsUploading(true);
        setHasAnalysis(false);
        setTimeout(() => {
            setIsUploading(false);
            setHasAnalysis(true);
        }, 1500);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Resume Screener</h1>
                <p className="page-subtitle">Upload your resume for an automated ATS check and scoring.</p>
            </div>

            <div className="resume-container">

                {/* Upload Section */}
                <div className="upload-section">
                    <div className="analysis-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '1rem' }}>
                        <h2 className="card-title">Upload Resume</h2>
                    </div>

                    <div className="upload-area" onClick={handleUpload}>
                        {isUploading ? (
                            <RefreshCw className="upload-icon animate-spin" size={48} />
                        ) : (
                            <UploadCloud className="upload-icon" size={48} />
                        )}
                        <h3 className="upload-title">
                            {isUploading ? "Analyzing..." : "Click or drag to upload"}
                        </h3>
                        <p className="upload-hint">PDF or DOCX (Max. 5MB)</p>
                    </div>

                    {hasAnalysis && (
                        <div className="flex" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <File size={24} color="var(--primary)" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>John_Doe_Resume_v2.pdf</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uploaded today at 10:45 AM</div>
                            </div>
                            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>View</button>
                        </div>
                    )}
                </div>

                {/* Analysis Section */}
                {hasAnalysis ? (
                    <div className="analysis-section animate-fade-in">
                        <div className="analysis-header">
                            <div className="analysis-score-box">
                                <div className="score-circle">75</div>
                                <div>
                                    <div className="score-label">Resume Score</div>
                                    <div className="score-status-text">Needs Improvement</div>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Download Report</button>
                        </div>

                        <div className="checklist-container">

                            <div className="checklist-item success">
                                <CheckCircle className="item-icon" size={20} />
                                <div className="item-content">
                                    <div className="item-title">Formatting & Consistency</div>
                                    <div className="item-desc">Clean layout detected. Standard fonts and margins are used.</div>
                                </div>
                            </div>

                            <div className="checklist-item warning">
                                <AlertTriangle className="item-icon" size={20} />
                                <div className="item-content">
                                    <div className="item-title">Action Verbs Usage</div>
                                    <div className="item-desc">Some bullet points are missing strong action verbs (e.g., 'Led', 'Developed'). Avoid using 'Responsible for'.</div>
                                </div>
                            </div>

                            <div className="checklist-item danger">
                                <XCircle className="item-icon" size={20} />
                                <div className="item-content">
                                    <div className="item-title">Measurable Impact</div>
                                    <div className="item-desc">Only 20% of your points contain metrics. Add numbers (%, $, time saved) to quantify your achievements.</div>
                                </div>
                            </div>

                            <div className="checklist-item success">
                                <CheckCircle className="item-icon" size={20} />
                                <div className="item-content">
                                    <div className="item-title">Core Skills / ATS Keywords</div>
                                    <div className="item-desc">Found 12 matching keywords for 'Software Engineer' roles (React, Java, SQL, REST APIs).</div>
                                </div>
                            </div>

                            <div className="checklist-item warning">
                                <AlertTriangle className="item-icon" size={20} />
                                <div className="item-content">
                                    <div className="item-title">Grammar & Spelling</div>
                                    <div className="item-desc">Found 1 potential typo in the 'Projects' section. Please review closely.</div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="analysis-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            <File size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>Upload a resume to see analysis here.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
