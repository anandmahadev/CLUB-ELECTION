/**
 * Voting Page
 * Shows candidates and allows student to cast vote
 * Handles: election closed state, already voted state, confirmation modal
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCandidates, submitVote } from '../services/api';
import Navbar from '../components/Navbar';
import ConfirmVoteModal from '../components/ConfirmVoteModal';
import Spinner from '../components/Spinner';

export default function VotingPage() {
    const { student, markVoted } = useAuth();
    const navigate = useNavigate();

    const [data, setData] = useState(null);        // { candidates, election_active, election_name, has_voted }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null); // Candidate being voted for
    const [showModal, setShowModal] = useState(false);
    const [voting, setVoting] = useState(false);
    const [voteError, setVoteError] = useState('');

    // Fetch candidates and election status
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await getCandidates();
            setData(res.data);

            // If student already voted (server says so)
            if (res.data.has_voted) {
                markVoted();
                navigate('/already-voted', { replace: true });
            }
        } catch (err) {
            if (err.response?.status !== 401) {
                setError('Failed to load candidates. Please refresh the page.');
            }
        } finally {
            setLoading(false);
        }
    }, [markVoted, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Prevent double-click: disable after first click
    const handleSelectCandidate = (candidate) => {
        if (voting) return;
        setSelected(candidate);
        setVoteError('');
        setShowModal(true);
    };

    const handleConfirmVote = async () => {
        if (!selected || voting) return;
        setVoting(true);
        setVoteError('');

        try {
            await submitVote({ candidate_id: selected.id });
            markVoted();
            navigate('/success', { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to submit vote.';
            if (err.response?.data?.already_voted) {
                markVoted();
                navigate('/already-voted', { replace: true });
            } else {
                setVoteError(msg);
                setShowModal(false);
            }
        } finally {
            setVoting(false);
        }
    };

    // ---- Render states ----
    if (loading) {
        return (
            <div className="page-wrapper">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Spinner size="lg" />
                        <p className="text-sm text-slate-400 mt-3">Loading candidates...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center max-w-sm">
                        <div className="alert-error mb-4">{error}</div>
                        <button onClick={fetchData} className="btn-secondary max-w-xs mx-auto">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const electionActive = data?.election_active;
    const candidates = data?.candidates || [];

    return (
        <div className="page-wrapper">
            <Navbar />

            <main className="flex-1 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-slate-900">
                                {data?.election_name || 'Cast Your Vote'}
                            </h1>
                            {electionActive ? (
                                <span className="badge-green">Live</span>
                            ) : (
                                <span className="badge-red">Closed</span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500">
                            Hello, <strong>{student?.name}</strong>. Select one candidate below.
                        </p>
                    </div>

                    {/* Vote error */}
                    {voteError && (
                        <div className="alert-error mb-4" role="alert">{voteError}</div>
                    )}

                    {/* Election closed notice */}
                    {!electionActive && (
                        <div className="alert-info mb-6">
                            <strong>Voting is currently closed.</strong> Please check back when the election is active.
                        </div>
                    )}

                    {/* Candidate list */}
                    {candidates.length === 0 ? (
                        <div className="card text-center py-12 text-slate-400">
                            <p className="text-sm">No candidates have been added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {candidates.map((candidate) => (
                                <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    disabled={!electionActive || voting}
                                    onSelect={handleSelectCandidate}
                                />
                            ))}
                        </div>
                    )}

                    {/* Instructions */}
                    <p className="text-xs text-slate-400 text-center mt-6">
                        Your vote is anonymous and final. You can only vote once.
                    </p>
                </div>
            </main>

            {/* Confirmation modal */}
            {showModal && (
                <ConfirmVoteModal
                    candidate={selected}
                    onConfirm={handleConfirmVote}
                    onCancel={() => !voting && setShowModal(false)}
                    loading={voting}
                />
            )}
        </div>
    );
}

// Candidate Card subcomponent
function CandidateCard({ candidate, disabled, onSelect }) {
    return (
        <div className={`card transition-shadow duration-150 ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-card-hover cursor-pointer'
            }`}>
            <div className="flex items-start gap-4">
                {/* Photo */}
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                    {candidate.photo_url ? (
                        <img
                            src={candidate.photo_url}
                            alt={candidate.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-semibold">
                            {candidate.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-slate-900 truncate">{candidate.name}</h2>
                    {(candidate.department || candidate.year) && (
                        <p className="text-xs text-slate-500 mt-0.5">
                            {[candidate.department, candidate.year].filter(Boolean).join(' · ')}
                        </p>
                    )}
                    {candidate.manifesto && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{candidate.manifesto}</p>
                    )}
                </div>

                {/* Vote button */}
                <button
                    id={`vote-btn-${candidate.id}`}
                    onClick={() => !disabled && onSelect(candidate)}
                    disabled={disabled}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
            ${disabled
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                >
                    Vote
                </button>
            </div>
        </div>
    );
}
