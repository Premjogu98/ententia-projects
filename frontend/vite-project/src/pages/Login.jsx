import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation attempt before API
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || "Login Failed");
        }
    };

    return (
        <div className="auth-page auth-login">
            <div className="card" style={{ width: '100%', maxWidth: '28rem', padding: '2rem' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p className="text-muted text-sm">Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                        Sign In
                    </button>
                </form>

                <div className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
