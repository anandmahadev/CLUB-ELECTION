/**
 * Navbar Component
 * Shown on student pages with college branding
 */
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { student, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-primary-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">Election Portal</span>
                </div>

                {/* Student info + logout */}
                {student && (
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 hidden sm:block">
                            {student.name} &middot; {student.roll_number}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-slate-600 hover:text-red-600 font-medium transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
