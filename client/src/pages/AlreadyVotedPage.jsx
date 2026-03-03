/**
 * Already Voted Page
 * Shown when a student tries to access voting after already voting
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function AlreadyVotedPage() {
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
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Already Voted</h1>
                    <p className="text-slate-500 text-sm mb-6">
                        Hello, <strong>{student?.name}</strong>. You have already cast your vote in this election.
                        Each student may vote only once.
                    </p>

                    <div className="alert-info mb-6 text-left">
                        Your vote has been recorded and is completely anonymous. Results will be announced
                        after the election closes.
                    </div>

                    <button
                        id="already-voted-logout-btn"
                        onClick={handleLogout}
                        className="btn-secondary"
                    >
                        Sign Out
                    </button>
                </div>
            </main>
        </div>
    );
}
