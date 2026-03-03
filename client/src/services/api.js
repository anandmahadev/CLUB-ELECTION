/**
 * Axios API Client
 * Centralized HTTP client with auth token injection
 */
import axios from 'axios';

// Base URL from env or proxy
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear stored tokens and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('student');
            // Only redirect if on student pages (not admin)
            if (!window.location.pathname.startsWith('/admin')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// =============================================
// Auth API
// =============================================
export const loginStudent = (data) => api.post('/auth/login', data);

// =============================================
// Voting API
// =============================================
export const getCandidates = () => api.get('/candidates');
export const submitVote = (data) => api.post('/vote', data);

// =============================================
// Admin API
// =============================================
const adminApi = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin';
        }
        return Promise.reject(error);
    }
);

export const adminLogin = (data) => adminApi.post('/admin/login', data);
export const adminGetDashboard = () => adminApi.get('/admin/dashboard');
export const adminGetCandidates = () => adminApi.get('/admin/candidates');
export const adminAddCandidate = (data) => adminApi.post('/admin/add-candidate', data);
export const adminDeleteCandidate = (id) => adminApi.delete(`/admin/candidates/${id}`);
export const adminUploadStudents = (formData) =>
    adminApi.post('/admin/upload-students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const adminGetStudents = () => adminApi.get('/admin/students');
export const adminStartElection = () => adminApi.post('/admin/start-election');
export const adminStopElection = () => adminApi.post('/admin/stop-election');
export const adminGetResults = () => adminApi.get('/admin/results');
export const adminExportResults = () =>
    adminApi.get('/admin/export-results', { responseType: 'blob' });

export default api;
