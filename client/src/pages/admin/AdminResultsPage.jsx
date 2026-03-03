/**
 * Admin Results Page
 * Shows aggregated vote counts per candidate
 * Admin sees ONLY counts — no student→candidate mapping shown in UI
 */
import { useState, useEffect, useCallback } from 'react';
import { adminGetResults, adminExportResults } from '../../services/api';
import AdminLayout from './AdminLayout';
import Spinner from '../../components/Spinner';

export default function AdminResultsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exporting, setExporting] = useState(false);

    const fetchResults = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await adminGetResults();
            setData(res.data);
        } catch {
            setError('Failed to load results.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchResults(); }, [fetchResults]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await adminExportResults();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'election_results.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            setError('Export failed. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const results = data?.results || [];
    const stats = data?.stats;
    const config = data?.config;
    const totalVotes = stats?.total_votes || 0;
    const winner = results[0];

    return (
        <AdminLayout>
            <div className="max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Election Results</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {config?.election_active ? 'Live results (election ongoing)' : 'Final results'}
                        </p>
                    </div>
                    <button
                        id="export-results-btn"
                        onClick={handleExport}
                        disabled={exporting || loading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white
                       text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {exporting ? <><Spinner size="sm" color="white" /> Exporting...</> : 'Export CSV'}
                    </button>
                </div>

                {error && <div className="alert-error mb-4">{error}</div>}

                {loading ? (
                    <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                ) : (
                    <>
                        {/* Summary stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { label: 'Total Eligible', value: stats?.total_students },
                                { label: 'Votes Cast', value: stats?.total_votes },
                                { label: 'Turnout', value: stats?.total_students ? `${Math.round((stats.total_voted / stats.total_students) * 100)}%` : '0%' },
                            ].map((s) => (
                                <div key={s.label} className="card text-center">
                                    <p className="text-xs text-slate-500">{s.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{s.value ?? '—'}</p>
                                </div>
                            ))}
                        </div>

                        {/* Winner highlight */}
                        {winner && totalVotes > 0 && !config?.election_active && (
                            <div className="card mb-4 border-l-4 border-green-500 bg-green-50">
                                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                                    Leading Candidate
                                </p>
                                <p className="text-lg font-bold text-slate-900">{winner.name}</p>
                                <p className="text-sm text-slate-600">
                                    {winner.vote_count} vote{winner.vote_count !== 1 ? 's' : ''}
                                    {totalVotes > 0 && ` — ${Math.round((winner.vote_count / totalVotes) * 100)}%`}
                                </p>
                            </div>
                        )}

                        {/* Candidate results */}
                        {results.length === 0 ? (
                            <div className="card text-center py-10 text-slate-400">
                                <p className="text-sm">No votes have been cast yet.</p>
                            </div>
                        ) : (
                            <div className="card">
                                <h2 className="text-sm font-semibold text-slate-800 mb-4">
                                    Vote Distribution
                                </h2>
                                <div className="space-y-4">
                                    {results.map((candidate, idx) => {
                                        const pct = totalVotes > 0
                                            ? Math.round((candidate.vote_count / totalVotes) * 100)
                                            : 0;
                                        return (
                                            <div key={candidate.id}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        {idx === 0 && totalVotes > 0 && (
                                                            <span className="text-xs text-green-600 font-bold">#1</span>
                                                        )}
                                                        <span className="text-sm font-medium text-slate-800">{candidate.name}</span>
                                                        {candidate.department && (
                                                            <span className="text-xs text-slate-400">{candidate.department}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-semibold text-slate-900">{candidate.vote_count}</span>
                                                        <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
                                                    </div>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${idx === 0 ? 'bg-primary-600' : 'bg-slate-300'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
