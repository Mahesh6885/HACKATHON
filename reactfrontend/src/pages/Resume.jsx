import { useState, useRef } from 'react';
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
    const [hasAnalysis, setHasAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);

        setUploadedFile({
            name: file.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            url: fileUrl
        });

        setIsUploading(true);
        setHasAnalysis(false);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/resume/upload/', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData,
            });

            if (!response.ok) {
                console.error("Failed to upload resume");
                // Fallback for demo purposes if backend fails
                setAnalysisResult({
                    score: 65,
                    formatting: { status: 'warning', text: 'Resume could not be analyzed fully. This is dummy feedback.' }
                });
            } else {
                const data = await response.json();
                setAnalysisResult(data);
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
        } finally {
            setIsUploading(false);
            setHasAnalysis(true);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Resume Screener</h1>
                <p className="page-subtitle">Upload your resume for an automated ATS check and scoring.</p>
            </div>

            <div className="resume-container">

                <div className="upload-section">
                    <div className="analysis-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '1rem' }}>
                        <h2 className="card-title">Upload Resume</h2>
                    </div>

                    <div className="upload-area" onClick={handleUploadClick}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                        />
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

                    {hasAnalysis && uploadedFile && (
                        <div className="flex" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <File size={24} color="var(--primary)" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{uploadedFile.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uploaded today at {uploadedFile.time}</div>
                            </div>
                            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => window.open(uploadedFile.url, '_blank')}>View</button>
                        </div>
                    )}
                </div>

                {/* Analysis Section */}
                {hasAnalysis && analysisResult ? (
                    <div className="analysis-section animate-fade-in">
                        <div className="analysis-header">
                            <div className="analysis-score-box">
                                <div className="score-circle">{analysisResult.score || 0}</div>
                                <div>
                                    <div className="score-label">Resume Score</div>
                                    <div className="score-status-text">
                                        {analysisResult.score >= 80 ? "Excellent" : analysisResult.score >= 50 ? "Needs Improvement" : "Poor"}
                                    </div>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Download Report</button>
                        </div>

                        <div className="checklist-container">
                            {analysisResult.feedback_items ? (
                                Object.keys(analysisResult.feedback_items).map((key, index) => {
                                    if (key === 'score') return null;
                                    const item = analysisResult.feedback_items[key];
                                    let statusClass = 'warning';
                                    if (Array.isArray(item)) {
                                        if (key === 'issues') statusClass = item.length === 0 ? 'success' : 'danger';
                                        else if (key === 'keywords') statusClass = item.length >= 5 ? 'success' : 'warning';
                                        else statusClass = item.length > 0 ? 'warning' : 'success'; // feedback
                                    } else {
                                        statusClass = item.status === 'success' || item.status === 'good' ? 'success' : (item.status === 'warning' ? 'warning' : 'danger');
                                    }

                                    return (
                                        <div key={index} className={`checklist-item ${statusClass}`}>
                                            {statusClass === 'success' ? <CheckCircle className="item-icon" size={20} /> :
                                                statusClass === 'warning' ? <AlertTriangle className="item-icon" size={20} /> :
                                                    <XCircle className="item-icon" size={20} />}
                                            <div className="item-content">
                                                <div className="item-title">{key.replace(/_/g, ' ').toUpperCase()}</div>
                                                <div className="item-desc">
                                                    {Array.isArray(item) ? (item.length > 0 ? item.join(', ') : 'None') : (typeof item === 'object' ? item.text || item.message : item)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <>
                                    {/* Fallback Display if API returns unknown shape */}
                                    <div className="checklist-item warning">
                                        <AlertTriangle className="item-icon" size={20} />
                                        <div className="item-content">
                                            <div className="item-title">Formatting</div>
                                            <div className="item-desc">{analysisResult.formatting?.text || 'Review your formatting.'}</div>
                                        </div>
                                    </div>
                                </>
                            )}
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
