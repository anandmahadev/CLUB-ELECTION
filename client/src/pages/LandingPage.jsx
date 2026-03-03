/**
 * Landing Page
 * Public homepage explaining the election
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function LandingPage() {
    const navigate = useNavigate();
    const { token, student } = useAuth();

    // If already logged in, redirect appropriately
    useEffect(() => {
        if (token && student) {
            if (student.has_voted) {
                navigate('/already-voted');
            } else {
                navigate('/vote');
            }
        }
    }, [token, student, navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-200 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-primary-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">Election Portal</span>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    {/* Badge */}
                    <span className="inline-block text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-full px-3 py-1 mb-6">
                        Official College Election
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                        College Club <br />President Election
                    </h1>

                    <p className="text-base text-slate-500 mb-10 leading-relaxed">
                        Cast your vote securely and anonymously. Your vote matters — one student, one vote.
                    </p>

                    {/* CTA */}
                    <button
                        id="landing-login-btn"
                        onClick={() => navigate('/login')}
                        className="btn-primary max-w-xs mx-auto"
                    >
                        Login to Vote
                    </button>

                    {/* Info grid */}
                    <div className="mt-14 grid grid-cols-3 gap-4 text-center border-t border-slate-100 pt-10">
                        {[
                            { label: 'Secure', desc: 'End-to-end protected' },
                            { label: 'Anonymous', desc: 'Your choice is private' },
                            { label: 'One Vote', desc: 'Per registered student' },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 px-4 py-4 text-center">
                <p className="text-xs text-slate-400">
                    Authorized students only &middot; All votes are final
                </p>
            </footer>
        </div>
    );
}
