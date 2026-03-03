/**
 * Admin Candidates Page
 * Add, view, and delete candidates
 */
import { useState, useEffect, useCallback } from 'react';
import { adminGetCandidates, adminAddCandidate, adminDeleteCandidate } from '../../services/api';
import AdminLayout from './AdminLayout';
import Spinner from '../../components/Spinner';

export default function AdminCandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Add form state
    const [form, setForm] = useState({ name: '', department: '', year: '', photo_url: '', manifesto: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchCandidates = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminGetCandidates();
            setCandidates(res.data.candidates);
        } catch {
            setError('Failed to load candidates.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFormError('');
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            setFormError('Candidate name is required.');
            return;
        }
        setFormLoading(true);
        setFormError('');
        setSuccess('');
        try {
            await adminAddCandidate(form);
            setSuccess('Candidate added successfully.');
            setForm({ name: '', department: '', year: '', photo_url: '', manifesto: '' });
            await fetchCandidates();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to add candidate.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove candidate "${name}"? This cannot be undone.`)) return;
        try {
            await adminDeleteCandidate(id);
            setSuccess(`"${name}" removed.`);
            setCandidates((prev) => prev.filter((c) => c.id !== id));
        } catch {
            setError('Failed to delete candidate.');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl">
                <h1 className="text-xl font-bold text-slate-900 mb-6">Candidates</h1>

                {/* Feedback */}
                {error && <div className="alert-error mb-4">{error}</div>}
                {success && <div className="alert-success mb-4">{success}</div>}

                {/* Add form */}
                <div className="card mb-6">
                    <h2 className="text-sm font-semibold text-slate-800 mb-4">Add New Candidate</h2>
                    <form onSubmit={handleAdd}>
                        {formError && <div className="alert-error mb-4">{formError}</div>}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="c-name" className="block text-xs font-medium text-slate-600 mb-1">
                                    Full Name *
                                </label>
                                <input id="c-name" name="name" value={form.name} onChange={handleChange}
                                    className="input-field" placeholder="Rahul Sharma" required />
                            </div>
                            <div>
                                <label htmlFor="c-dept" className="block text-xs font-medium text-slate-600 mb-1">
                                    Department
                                </label>
                                <input id="c-dept" name="department" value={form.department} onChange={handleChange}
                                    className="input-field" placeholder="Computer Science" />
                            </div>
                            <div>
                                <label htmlFor="c-year" className="block text-xs font-medium text-slate-600 mb-1">
                                    Year
                                </label>
                                <input id="c-year" name="year" value={form.year} onChange={handleChange}
                                    className="input-field" placeholder="3rd Year" />
                            </div>
                            <div>
                                <label htmlFor="c-photo" className="block text-xs font-medium text-slate-600 mb-1">
                                    Photo URL (optional)
                                </label>
                                <input id="c-photo" name="photo_url" value={form.photo_url} onChange={handleChange}
                                    className="input-field" placeholder="https://..." />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="c-manifesto" className="block text-xs font-medium text-slate-600 mb-1">
                                Manifesto / Description
                            </label>
                            <textarea id="c-manifesto" name="manifesto" value={form.manifesto} onChange={handleChange}
                                rows={3} className="input-field resize-none"
                                placeholder="Briefly describe the candidate's platform..." />
                        </div>

                        <button id="add-candidate-btn" type="submit" disabled={formLoading}
                            className="btn-primary max-w-xs flex items-center justify-center gap-2">
                            {formLoading ? <><Spinner size="sm" color="white" /> Adding...</> : 'Add Candidate'}
                        </button>
                    </form>
                </div>

                {/* Candidates list */}
                <div className="card">
                    <h2 className="text-sm font-semibold text-slate-800 mb-4">
                        All Candidates ({candidates.length})
                    </h2>
                    {loading ? (
                        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
                    ) : candidates.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">No candidates yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {candidates.map((c) => (
                                <div key={c.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                                        {c.photo_url ? (
                                            <img src={c.photo_url} alt={c.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold text-sm">
                                                {c.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                                        {(c.department || c.year) && (
                                            <p className="text-xs text-slate-500">{[c.department, c.year].filter(Boolean).join(' · ')}</p>
                                        )}
                                        {c.manifesto && (
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{c.manifesto}</p>
                                        )}
                                    </div>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(c.id, c.name)}
                                        className="btn-danger flex-shrink-0"
                                        title="Remove candidate"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
