import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './layouts/Layout';
import DriverPage from './pages/DriverPage';
import CamionPage from './pages/CamionPage';
import RegionPage from './pages/RegionPage';

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
            <Routes>
                <Route path="/login" element={user==null ? <LoginPage /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={user==null ? <SignupPage /> : <Navigate to="/dashboard" />} />
                <Route element={user ? <Layout /> : <LoginPage />}>
                    <Route path="/dashboard" element={<DashboardPage />}/>
                    <Route path="/driver" element={<DriverPage />}/>
                    <Route path="/camion" element={<CamionPage />}/>
                    <Route path="/region" element={<RegionPage />}/>
                    <Route path="/" element={<DashboardPage />}/>

                </Route>
                
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
    );
};

export default AppRoutes;
