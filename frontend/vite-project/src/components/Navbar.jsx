import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-content">
                {/* Brand */}
                <div className="flex items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <div style={{
                        width: '2rem', height: '2rem', background: 'var(--primary)',
                        borderRadius: '0.5rem', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 'bold'
                    }}>E</div>
                    <h1 className="font-bold" style={{ fontSize: '1.25rem' }}>ntentia</h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="btn-icon"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {user && (
                        <div className="flex items-center gap-4" style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span className="text-sm font-bold">{user.email.split('@')[0]}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="btn-icon"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
