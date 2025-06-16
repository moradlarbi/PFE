import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    const lastPath = localStorage.getItem('lastPath') || '/region';
    return user ? <Navigate to={lastPath} replace /> : <Outlet />;
};

export default PublicRoute;
