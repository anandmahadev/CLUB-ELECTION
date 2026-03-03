/**
 * Login Page
 * Student login with roll number and password
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginStudent } from '../services/api';
import Spinner from '../components/Spinner';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ roll_number: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.roll_number.trim() || !form.password) {
            setError('Please enter your roll number and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await loginStudent(form);
            const { token, student } = res.data;

            // Store auth and redirect
            login(student, token);

            if (student.has_voted) {
                navigate('/already-voted', { replace: true });
            } else {
                navigate('/vote', { replace: true });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Election Portal</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign in with your student credentials</p>
                </div>

                {/* Form card */}
                <div className="card">
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Error */}
                        {error && (
                            <div className="alert-error mb-4" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Roll Number */}
                        <div className="mb-4">
                            <label htmlFor="roll_number" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Roll Number
                            </label>
                            <input
                                id="roll_number"
                                name="roll_number"
                                type="text"
                                autoComplete="username"
                                placeholder="e.g. CSE2021001"
                                value={form.roll_number}
                                onChange={handleChange}
                                className="input-field"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                className="input-field"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit-btn"
                            type="submit"
                            className="btn-primary flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" color="white" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                {/* Info */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    Your credentials were provided by the election administrator.
                </p>
            </div>
        </div>
    );
}
