/**
 * Admin Dashboard
 * Overview stats and election controls
 */
import { useState, useEffect, useCallback } from 'react';
import { adminGetDashboard, adminStartElection, adminStopElection } from '../../services/api';
import AdminLayout from './AdminLayout';
import Spinner from '../../components/Spinner';

function StatCard({ label, value, sub }) {
    return (
        <div className="card">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value ?? '—'}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
    );
}

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionMsg, setActionMsg] = useState('');

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await adminGetDashboard();
            setData(res.data);
        } catch {
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const handleElectionToggle = async () => {
        if (actionLoading) return;
        const active = data?.config?.election_active;
        const confirmed = window.confirm(
            active
                ? 'Stop the election? No more votes can be cast after this.'
                : 'Start the election? Students will be able to vote immediately.'
        );
        if (!confirmed) return;

        setActionLoading(true);
        setActionMsg('');
        try {
            if (active) {
                await adminStopElection();
                setActionMsg('Election stopped successfully.');
            } else {
                await adminStartElection();
                setActionMsg('Election started successfully.');
            }
            await fetchDashboard();
        } catch (err) {
            setActionMsg(err.response?.data?.message || 'Action failed.');
        } finally {
            setActionLoading(false);
        }
    };

    const stats = data?.stats;
    const config = data?.config;
    const turnout = stats?.total_students
        ? Math.round((stats.total_voted / stats.total_students) * 100)
        : 0;

    return (
        <AdminLayout>
            <div className="max-w-3xl">
                {/* Title */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {config?.election_name || 'College Club President Election'}
                        </p>
                    </div>
                    {config && (
                        <span className={config.election_active ? 'badge-green' : 'badge-red'}>
                            {config.election_active ? 'Election Live' : 'Election Closed'}
                        </span>
                    )}
                </div>

                {/* Error */}
                {error && <div className="alert-error mb-4">{error}</div>}
                {actionMsg && <div className="alert-info mb-4">{actionMsg}</div>}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <>
                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            <StatCard label="Total Students" value={stats?.total_students} />
                            <StatCard label="Votes Cast" value={stats?.total_votes} />
                            <StatCard label="Candidates" value={stats?.total_candidates} />
                            <StatCard label="Turnout" value={`${turnout}%`} sub={`${stats?.total_voted} voted`} />
                        </div>

                        {/* Election Control */}
                        <div className="card mb-6">
                            <h2 className="text-sm font-semibold text-slate-800 mb-1">Election Control</h2>
                            <p className="text-xs text-slate-500 mb-4">
                                {config?.election_active
                                    ? `Started: ${config.started_at ? new Date(config.started_at).toLocaleString() : 'Active'}`
                                    : config?.ended_at
                                        ? `Ended: ${new Date(config.ended_at).toLocaleString()}`
                                        : 'Election has not been started yet.'}
                            </p>
                            <button
                                id={config?.election_active ? 'stop-election-btn' : 'start-election-btn'}
                                onClick={handleElectionToggle}
                                disabled={actionLoading}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors
                  ${config?.election_active
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {actionLoading ? (
                                    <><Spinner size="sm" color="white" /> Processing...</>
                                ) : config?.election_active ? (
                                    'Stop Election'
                                ) : (
                                    'Start Election'
                                )}
                            </button>
                        </div>

                        {/* Quick links */}
                        <div className="card">
                            <h2 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: 'Manage Candidates', to: '/admin/candidates' },
                                    { label: 'Upload Students', to: '/admin/students' },
                                    { label: 'View Results', to: '/admin/results' },
                                ].map((link) => (
                                    <a
                                        key={link.to}
                                        href={link.to}
                                        className="block px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200
                               text-sm font-medium text-slate-700 transition-colors"
                                    >
                                        {link.label} →
                                    </a>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
