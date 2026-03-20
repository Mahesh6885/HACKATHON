import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [identifier, setIdentifier] = useState('');  // roll number OR email
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed. Please check your credentials.');
                setIsLoading(false);
                return;
            }

            // Store tokens and user info
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userName', data.user.display_name);

            // Route based on role
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Cannot connect to server. Please ensure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card animate-fade-in">
                <div className="login-header">
                    <div className="login-logo">
                        <GraduationCap size={32} strokeWidth={2} />
                    </div>
                    <h1 className="login-title">SkillSprint</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Students: use your Roll Number &nbsp;|&nbsp; Admin: use your Email
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px',
                        padding: '0.75rem 1rem', marginBottom: '1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontSize: '0.85rem', color: '#dc2626',
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="identifier">
                            Roll Number / Email
                        </label>
                        <div className="input-icon-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                id="identifier"
                                type="text"
                                className="input-with-icon"
                                placeholder="e.g. 21CS001 or admin@skillsprint.edu"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="input-icon-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                id="password"
                                type="password"
                                className="input-with-icon"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="login-options">
                        <label className="checkbox-group">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn-primary btn-login" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : (
                            <>Sign In <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                {/* Quick credential reference */}
                <div style={{
                    marginTop: '1.5rem', padding: '1rem',
                    background: 'var(--bg-primary)', borderRadius: '10px',
                    fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.8,
                }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Demo Credentials</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 1rem', marginTop: '0.5rem' }}>
                        <span>👤 Student</span><span><code>21CS001</code> / <code>Pass@2024</code></span>
                        <span>👤 Student</span><span><code>21CS002</code> / <code>Pass@2024</code></span>
                        <span>🔑 Admin</span><span><code>admin@skillsprint.edu</code> / <code>Admin@123</code></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
