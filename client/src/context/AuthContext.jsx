/**
 * Auth Context
 * Provides student auth state across the app
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [student, setStudent] = useState(() => {
        try {
            const stored = localStorage.getItem('student');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    const login = useCallback((studentData, jwtToken) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('student', JSON.stringify(studentData));
        setToken(jwtToken);
        setStudent(studentData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        setToken(null);
        setStudent(null);
    }, []);

    // Update has_voted flag locally after voting
    const markVoted = useCallback(() => {
        setStudent((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, has_voted: true };
            localStorage.setItem('student', JSON.stringify(updated));
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider value={{ student, token, login, logout, markVoted }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

// =============================================
// Admin Auth Context
// =============================================
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(() => {
        try {
            const stored = localStorage.getItem('adminUser');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const adminLogin = useCallback((adminData, jwtToken) => {
        localStorage.setItem('adminToken', jwtToken);
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        setAdmin(adminData);
    }, []);

    const adminLogout = useCallback(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setAdmin(null);
    }, []);

    return (
        <AdminAuthContext.Provider value={{ admin, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
