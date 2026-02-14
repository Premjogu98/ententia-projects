import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const result = await register(formData.email, formData.password);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="auth-page auth-register">
            <div className="card" style={{ width: '100%', maxWidth: '28rem', padding: '2.5rem', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#0F172A' }}>Get Started</h2>
                    <p className="text-muted text-sm">Create your Ententia account</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#0F172A' }}>Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#0F172A' }}>Password</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#0F172A' }}>Confirm Password</label>
                        <input
                            className="form-input"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-dark w-full" style={{ marginTop: '1rem' }}>
                        Create Account
                    </button>
                </form>

                <div className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#0F172A', fontWeight: 'bold' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
