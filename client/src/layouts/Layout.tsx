// src/components/Layout.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        MyApp
                    </Typography>
                    {user && (
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </div>
    );
};

export default Layout;
