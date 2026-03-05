import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Route based on input data instead of role selection
            if (email.toLowerCase().includes('admin')) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }, 800);
    };

    return (
        <div className="login-container">
            <div className="login-card animate-fade-in">
                <div className="login-header">
                    <div className="login-logo">
                        <GraduationCap size={32} strokeWidth={2} />
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your Placement Dashboard</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div className="input-icon-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                id="email"
                                type="email"
                                className="input-with-icon"
                                placeholder="student@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                            <>
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
