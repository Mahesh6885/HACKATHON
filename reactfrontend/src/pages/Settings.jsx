import { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Building, Save, Loader2, CheckCircle, Bell, Shield, Palette, Moon, Sun } from 'lucide-react';

const BACKEND = 'http://localhost:8000';

export default function Settings() {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);

    // Editable profile fields
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');

    // Preferences
    const [notifMock, setNotifMock] = useState(true);
    const [notifResume, setNotifResume] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND}/api/auth/profile/`)
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setDisplayName(data.display_name || data.username || '');
                setEmail(data.email || '');
            })
            .catch(err => console.error('Failed to load profile', err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // For hackathon — just simulate save (profile update endpoint not wired in backend yet)
        setTimeout(() => {
            setIsSaving(false);
            setSavedOk(true);
            setTimeout(() => setSavedOk(false), 2000);
        }, 800);
    };

    if (isLoading) return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto', color: 'var(--primary)' }} />
        </div>
    );

    const cardStyle = {
        background: 'white',
        borderRadius: '14px',
        padding: '1.75rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '1.5rem',
    };

    const sectionTitle = (Icon, label) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <Icon size={18} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</h2>
        </div>
    );

    const toggle = (value, onChange, label, desc) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
            <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{label}</div>
                {desc && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{desc}</div>}
            </div>
            <div onClick={() => onChange(!value)} style={{
                width: '42px', height: '24px',
                background: value ? 'var(--primary)' : '#d1d5db',
                borderRadius: '12px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
            }}>
                <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: value ? '21px' : '3px',
                    width: '18px', height: '18px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '700px' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your profile and notification preferences.</p>
            </div>

            {/* Profile Card */}
            <div style={cardStyle}>
                {sectionTitle(User, 'Your Profile')}

                {/* Avatar badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '1.4rem',
                    }}>
                        {(displayName || 'U').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{displayName || profile?.username}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{profile?.role_desc}</div>
                        {profile?.department && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{profile.department}</div>}
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={13} /> Display Name</label>
                        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={13} /> Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Building size={13} /> Department</label>
                        <input type="text" value={profile?.role_desc || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GraduationCap size={13} /> Role</label>
                        <input type="text" value={(profile?.role || 'student').charAt(0).toUpperCase() + (profile?.role || 'student').slice(1)} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : savedOk ? <CheckCircle size={16} /> : <Save size={16} />}
                            {isSaving ? 'Saving…' : savedOk ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Notification Preferences */}
            <div style={cardStyle}>
                {sectionTitle(Bell, 'Notifications')}
                {toggle(notifMock, setNotifMock, 'Mock Interview Reminders', 'Get reminded to practice weekly mock interviews')}
                {toggle(notifResume, setNotifResume, 'Resume Score Updates', 'Notify when a new ATS score is calculated')}
            </div>

            {/* Appearance */}
            <div style={cardStyle}>
                {sectionTitle(Palette, 'Appearance')}
                {toggle(darkMode, setDarkMode, 'Dark Mode', 'Switch to a dark colour scheme (coming soon)')}
            </div>

            {/* Account Info */}
            <div style={cardStyle}>
                {sectionTitle(Shield, 'Account')}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p><strong>Username:</strong> {profile?.username}</p>
                    <p style={{ marginTop: '0.4rem' }}><strong>Account type:</strong> {profile?.role === 'admin' ? 'Administrator' : 'Student'}</p>
                </div>
            </div>
        </div>
    );
}
