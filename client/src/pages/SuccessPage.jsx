/**
 * Success Page
 * Shown after a student successfully casts their vote
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function SuccessPage() {
    const { student, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm text-center">
                    {/* Success icon */}
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Vote Submitted!</h1>
                    <p className="text-slate-500 text-sm mb-6">
                        Thank you, <strong>{student?.name}</strong>. Your vote has been recorded successfully
                        and is completely anonymous.
                    </p>

                    <div className="card text-left mb-6">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">Vote Recorded</p>
                                <p className="text-xs text-slate-500 mt-0.5">Your selection has been saved securely.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 mt-4">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">Anonymous</p>
                                <p className="text-xs text-slate-500 mt-0.5">No one can trace this vote back to you.</p>
                            </div>
                        </div>
                    </div>

                    <button
                        id="success-logout-btn"
                        onClick={handleLogout}
                        className="btn-secondary"
                    >
                        Done — Sign Out
                    </button>
                </div>
            </main>
        </div>
    );
}
