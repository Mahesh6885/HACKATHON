import { useState, useEffect } from 'react';
import { Award, ExternalLink, Plus, Cloud, Database, Code, Shield, Loader2, CheckCircle } from 'lucide-react';
import './Certifications.css';

const API_URL = 'http://localhost:8000/api/certs/';

function getIcon(category) {
    if (!category) return Code;
    const c = category.toUpperCase();
    if (c === 'CLOUD' || c === 'Cloud') return Cloud;
    if (c === 'DATA' || c.includes('DATA')) return Database;
    if (c === 'SECURITY') return Shield;
    return Code;
}

function getGradient(category) {
    if (!category) return 'gradient-dev';
    const c = category.toUpperCase();
    if (c === 'CLOUD') return 'gradient-cloud';
    if (c.includes('DATA')) return 'gradient-data';
    return 'gradient-dev';
}

function mapApiCert(cert) {
    return {
        id: cert.id,
        title: cert.title,
        platform: cert.platform,
        date: cert.completed_at ? new Date(cert.completed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : cert.date_earned || '',
        category: cert.category,
        link: cert.credential_url || '#',
        Icon: getIcon(cert.category),
        gradient: getGradient(cert.category),
    };
}

export default function Certifications() {
    const [certifications, setCertifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newCert, setNewCert] = useState({ title: '', platform: '', date_earned: '', category: 'Development', credential_url: '' });

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCertifications(data.map(mapApiCert));
                }
            })
            .catch(err => console.error('Failed to load certifications', err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleAddCert = () => { setIsFormOpen(true); setSavedOk(false); };

    const submitCert = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                title: newCert.title,
                platform: newCert.platform,
                category: newCert.category.toUpperCase().replace(' ', '_').slice(0, 8),
                credential_url: newCert.credential_url || '',
            };
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const saved = await res.json();
                setCertifications(prev => [mapApiCert(saved), ...prev]);
                setSavedOk(true);
                setTimeout(() => {
                    setIsFormOpen(false);
                    setSavedOk(false);
                    setNewCert({ title: '', platform: '', date_earned: '', category: 'Development', credential_url: '' });
                }, 1200);
            } else {
                const err = await res.json();
                console.error('Save failed', err);
            }
        } catch (err) {
            console.error('Network error saving cert', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Certifications</h1>
                    <p className="page-subtitle">Manage your earned certificates and skill badges.</p>
                </div>
                <button className="btn-primary" onClick={handleAddCert}>
                    <Plus size={18} /> Add Certification
                </button>
            </div>

            <div className="certs-container">
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto', color: 'var(--primary)' }} />
                    </div>
                ) : certifications.length > 0 ? (
                    <div className="certs-grid">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="cert-card animate-fade-in">
                                <div className={`cert-gradient ${cert.gradient}`}></div>
                                <div className="cert-content">
                                    <div className="cert-header">
                                        <div className="cert-icon">
                                            <cert.Icon size={24} color="var(--primary)" />
                                        </div>
                                        <span className="cert-category">{cert.category}</span>
                                    </div>
                                    <h3 className="cert-title">{cert.title}</h3>
                                    <div className="cert-platform">{cert.platform}</div>
                                    <div className="cert-footer">
                                        <span className="cert-date">Issued: {cert.date}</span>
                                        <a href={cert.link !== '#' ? cert.link : `https://google.com/search?q=${encodeURIComponent(cert.title)}`} className="cert-link" target="_blank" rel="noopener noreferrer">
                                            View Credential <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="cert-card animate-fade-in" style={{ borderStyle: 'dashed', cursor: 'pointer', background: 'transparent' }} onClick={handleAddCert}>
                            <div className="cert-content" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <div className="cert-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1rem' }}>
                                    <Plus size={24} />
                                </div>
                                <h3 className="cert-title">Add Certification</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Showcase a new skill</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state animate-fade-in">
                        <Award className="empty-icon" size={64} />
                        <h2 className="empty-title">No Certifications Yet</h2>
                        <p className="empty-desc">Adding certifications can significantly boost your placement readiness score up to 20%.</p>
                        <button className="btn-primary" onClick={handleAddCert}>
                            <Plus size={18} /> Add Your First Certification
                        </button>
                    </div>
                )}

                {isFormOpen && (
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} className="animate-fade-in">
                        <h3 className="section-title">Add New Certification</h3>
                        <form onSubmit={submitCert} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input required type="text" placeholder="e.g. AWS Certified" value={newCert.title} onChange={e => setNewCert({ ...newCert, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Platform / Issuer</label>
                                <input required type="text" placeholder="e.g. Coursera" value={newCert.platform} onChange={e => setNewCert({ ...newCert, platform: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select value={newCert.category} onChange={e => setNewCert({ ...newCert, category: e.target.value })} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}>
                                    <option value="Development">Development</option>
                                    <option value="Cloud">Cloud</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Security">Security</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Credential URL (optional)</label>
                                <input type="url" placeholder="https://" value={newCert.credential_url} onChange={e => setNewCert({ ...newCert, credential_url: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                <button type="submit" className="btn-primary" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : savedOk ? <CheckCircle size={16} /> : <Plus size={16} />}
                                    {isSaving ? 'Saving...' : savedOk ? 'Saved!' : 'Save Certification'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
