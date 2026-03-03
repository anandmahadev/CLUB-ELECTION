/**
 * Admin Students Page
 * Upload students via CSV and view student list
 *
 * CSV format: name, roll_number, department, year, password
 */
import { useState, useEffect, useCallback } from 'react';
import { adminGetStudents, adminUploadStudents } from '../../services/api';
import AdminLayout from './AdminLayout';
import Spinner from '../../components/Spinner';

export default function AdminStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uploadResult, setUploadResult] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminGetStudents();
            setStudents(res.data.students);
        } catch {
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
        setUploadResult(null);
        setError('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a CSV file first.');
            return;
        }
        setUploading(true);
        setError('');
        setUploadResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await adminUploadStudents(formData);
            setUploadResult(res.data);
            setFile(null);
            // Reset file input
            document.getElementById('csv-upload-input').value = '';
            await fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const voted = students.filter((s) => s.has_voted).length;

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <h1 className="text-xl font-bold text-slate-900 mb-6">Students</h1>

                {error && <div className="alert-error mb-4">{error}</div>}

                {/* Upload section */}
                <div className="card mb-6">
                    <h2 className="text-sm font-semibold text-slate-800 mb-1">Upload Students via CSV</h2>
                    <p className="text-xs text-slate-500 mb-4">
                        CSV must have headers: <code className="bg-slate-100 px-1 rounded">name, roll_number, department, year, password</code>
                    </p>

                    {uploadResult && (
                        <div className={`mb-4 ${uploadResult.success ? 'alert-success' : 'alert-error'}`}>
                            {uploadResult.message}
                            {uploadResult.errors?.length > 0 && (
                                <ul className="mt-1 text-xs list-disc list-inside">
                                    {uploadResult.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                        <div className="flex-1">
                            <label htmlFor="csv-upload-input" className="block text-xs font-medium text-slate-600 mb-1">
                                Select CSV File
                            </label>
                            <input
                                id="csv-upload-input"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3
                           file:rounded-lg file:border-0 file:text-xs file:font-semibold
                           file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100
                           cursor-pointer"
                            />
                        </div>
                        <button id="upload-students-btn" type="submit" disabled={uploading || !file}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700
                         text-white text-sm font-semibold rounded-lg transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                            {uploading ? <><Spinner size="sm" color="white" /> Uploading...</> : 'Upload CSV'}
                        </button>
                    </form>
                </div>

                {/* Sample CSV download */}
                <div className="card mb-6 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-700 mb-2">Sample CSV Format</h2>
                    <pre className="text-xs text-slate-600 font-mono bg-white border border-slate-200 rounded p-3 overflow-x-auto">
                        {`name,roll_number,department,year,password
Rahul Sharma,CSE2021001,Computer Science,3rd Year,Pass@123
Priya Verma,ECE2022010,Electronics,2nd Year,Pass@456`}
                    </pre>
                </div>

                {/* Students table */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-800">
                            All Students ({students.length})
                        </h2>
                        <span className="text-xs text-slate-500">{voted} voted</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
                    ) : students.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">No students uploaded yet.</p>
                    ) : (
                        <div className="overflow-x-auto -mx-6 -mb-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-y border-slate-200">
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600">Name</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600">Roll No.</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hidden sm:table-cell">Dept.</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 hidden sm:table-cell">Year</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600">Voted</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((s) => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                                            <td className="px-4 py-3 text-slate-600 font-mono text-xs">{s.roll_number}</td>
                                            <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{s.department || '—'}</td>
                                            <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{s.year || '—'}</td>
                                            <td className="px-4 py-3">
                                                {s.has_voted
                                                    ? <span className="badge-green">Yes</span>
                                                    : <span className="badge-slate">No</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
