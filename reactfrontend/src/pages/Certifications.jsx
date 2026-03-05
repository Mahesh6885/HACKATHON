import { Award, ExternalLink, Plus, Cloud, Database, Code, Shield } from 'lucide-react';
import './Certifications.css';

export default function Certifications() {
    const certifications = [
        {
            id: 1,
            title: 'AWS Certified Solutions Architect – Associate',
            platform: 'Amazon Web Services',
            date: 'Aug 2025',
            category: 'Cloud',
            gradient: 'gradient-cloud',
            Icon: Cloud,
            link: '#'
        },
        {
            id: 2,
            title: 'Meta Front-End Developer Professional Certificate',
            platform: 'Coursera',
            date: 'Jan 2026',
            category: 'Development',
            gradient: 'gradient-dev',
            Icon: Code,
            link: '#'
        },
        {
            id: 3,
            title: 'Google Data Analytics Professional Certificate',
            platform: 'Google / Coursera',
            date: 'Nov 2025',
            category: 'Data Science',
            gradient: 'gradient-data',
            Icon: Database,
            link: '#'
        }
    ];

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Certifications</h1>
                    <p className="page-subtitle">Manage your earned certificates and skill badges.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Add Certification
                </button>
            </div>

            <div className="certs-container">
                {certifications.length > 0 ? (
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
                                        <a href={cert.link} className="cert-link" target="_blank" rel="noopener noreferrer">
                                            View Credential <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* "Add New" Card styled similarly */}
                        <div className="cert-card animate-fade-in" style={{ borderStyle: 'dashed', cursor: 'pointer', background: 'transparent' }}>
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
                        <button className="btn-primary">
                            <Plus size={18} /> Add Your First Certification
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
