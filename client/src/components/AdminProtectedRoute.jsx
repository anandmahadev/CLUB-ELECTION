/**
 * AdminProtectedRoute Component
 * Redirects to /admin if admin is not authenticated
 */
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';

export default function AdminProtectedRoute({ children }) {
    const { admin } = useAdminAuth();
    if (!admin) {
        return <Navigate to="/admin" replace />;
    }
    return children;
}
