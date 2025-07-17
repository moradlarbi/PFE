import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Link, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(email, password);
            setError(null);
        } catch (error) {
            setError('Failed to login. Please check your email and password.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
            >
                <Typography variant="h4" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
                {/* <Typography variant="body2" align="center" marginTop={2}>
                    Don't have an account? <Link href="/signup" color="primary">Sign Up</Link>
                </Typography> */}
            </Box>
        </Container>
    );
};

export default LoginPage;
