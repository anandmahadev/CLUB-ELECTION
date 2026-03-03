/**
 * Admin Login Page
 * Separate admin authentication at /admin
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/api';
import Spinner from '../../components/Spinner';

export default function AdminLoginPage() {
    const { adminLogin: setAdminAuth } = useAdminAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.password) {
            setError('Please enter your username and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await adminLogin(form);
            const { token, admin } = res.data;
            setAdminAuth(admin, token);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    <p className="text-sm text-slate-400 mt-1">Election Management System</p>
                </div>

                {/* Form */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <form onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="admin-username" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Username
                            </label>
                            <input
                                id="admin-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder="admin"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg
                           text-slate-100 placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <input
                                id="admin-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg
                           text-slate-100 placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                disabled={loading}
                                required
                            />
                        </div>

                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold
                         py-3 px-6 rounded-lg transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" color="white" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign In as Admin'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-500 mt-6">
                    Restricted access. Authorized administrators only.
                </p>
            </div>
        </div>
    );
}
