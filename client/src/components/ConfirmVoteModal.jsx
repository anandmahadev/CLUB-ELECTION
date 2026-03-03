/**
 * ConfirmVoteModal Component
 * Displays a confirmation dialog before submitting vote
 */
import Spinner from './Spinner';

export default function ConfirmVoteModal({ candidate, onConfirm, onCancel, loading }) {
    if (!candidate) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop click to cancel */}
            <div className="absolute inset-0" onClick={onCancel} />

            <div className="relative bg-white rounded-t-2xl sm:rounded-xl w-full max-w-sm mx-auto p-6 shadow-xl">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <h2 id="modal-title" className="text-lg font-bold text-slate-900 text-center mb-1">
                    Confirm Your Vote
                </h2>
                <p className="text-sm text-slate-500 text-center mb-5">
                    This action cannot be undone. You can only vote once.
                </p>

                {/* Candidate summary */}
                <div className="bg-slate-50 rounded-lg px-4 py-3 mb-5 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-0.5">You are voting for:</p>
                    <p className="text-base font-semibold text-slate-900">{candidate.name}</p>
                    {candidate.department && (
                        <p className="text-xs text-slate-500 mt-0.5">{candidate.department}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        id="confirm-vote-btn"
                        onClick={onConfirm}
                        disabled={loading}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" color="white" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            'Confirm Vote'
                        )}
                    </button>
                    <button
                        id="cancel-vote-btn"
                        onClick={onCancel}
                        disabled={loading}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
