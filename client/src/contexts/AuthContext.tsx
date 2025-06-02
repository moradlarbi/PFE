import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface User {
    email: string;
    id: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: { type: string; payload?: User }): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'STOP_LOADING':
            return { ...state, loading: false };
        case 'LOGIN':
            return { user: action.payload || null, loading: false };
        case 'LOGOUT':
            return { user: null, loading: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null, loading: false });
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        dispatch({ type: 'SET_LOADING' });

        axios
            .get('/auth/isAuthenticated', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                dispatch({ type: 'LOGIN', payload: response.data });
            })
            .catch(() => {
                dispatch({ type: 'LOGOUT' });
                localStorage.removeItem('token');
            })
            .finally(() => {
                dispatch({ type: 'STOP_LOADING' }); // Stop loading après la requête
            });
    }, []);

    const login = async (email: string, password: string) => {
        dispatch({ type: 'SET_LOADING' });

        try {
            const response = await axios.post('/auth/login', { email, password });
            const token = response.data.token;
            localStorage.setItem('token', token);

            dispatch({ type: 'LOGIN', payload: { email: response.data.data.email, id: response.data.data.id } });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to login:', error);
            throw error;
        } finally {
            dispatch({ type: 'STOP_LOADING' }); // Arrêter le chargement même en cas d'erreur
        }
    };

    const logout = async () => {
        try {
            await axios.get('/auth/logout')
            .then(() => {
                console.log('Logout successful');
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
                navigate('/login');
            }).catch((error) => {
                console.error('Logout failed:', error);
                throw error;
            });
            
        } catch (error) {
            console.error('Failed to logout:', error);
            throw error;
        }
    };

    return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
