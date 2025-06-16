import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './layouts/Layout';
import DriverPage from './pages/DriverPage';
import CamionPage from './pages/CamionPage';
import RegionPage from './pages/RegionPage';
import TrashPage from './pages/TrashPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const LastPathTracker: React.FC = () => {
    const location = useLocation();
    useEffect(() => {
        const publicPaths = ['/login', '/signup'];
        if (!publicPaths.includes(location.pathname)) {
            localStorage.setItem('lastPath', location.pathname);
        }
    }, [location]);
    return null;
};

const AppRoutes: React.FC = () => {
    const { loading } = useAuth();

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '20%' }}>Loading...</div>;
    }

    return (
        <>
            <LastPathTracker />
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/driver" element={<DriverPage />} />
                        <Route path="/camion" element={<CamionPage />} />
                        <Route path="/region" element={<RegionPage />} />
                        <Route path="/trash" element={<TrashPage />} />
                        <Route path="/" element={<DashboardPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </>
            
    );
};

export default AppRoutes;
