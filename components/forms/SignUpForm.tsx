import { useRouter } from 'next/router';
import * as React from 'react';
import { useState, useEffect } from 'react';

import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

import Copyright from '../../components/Copyright';
import { ApiUtils } from '../../utils/api-utils';
import { isValidEmail } from '../../utils/email-validation';
import useAlertMessage from '../../hooks/useAlertMessage';
import { AuthUtils } from '../../utils/auth-utils';
import AlertMessage from '../../components/AlertMessage';


const SignUpForm = () => {
    const router = useRouter();

    const { executeRecaptcha } = useGoogleReCaptcha();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            router.push('/home');
        }
    }, [])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (username.trim() == "" || password.trim() == "" || !isValidEmail(email)) {
            setMessageWithType("Please fill required fields", "error")
            return;
        }

        // If recaptcha is not ready
        if (!executeRecaptcha) {
            setMessageWithType("Recaptcha is not available", "error")
            return;
        }

        const token = await executeRecaptcha('signUp');

        const body = JSON.stringify({
            email: email.trim(),
            username: username.trim(),
            password: password.trim(),
            captcha: token
        });

        const response = await fetch(`${ApiUtils.getApiUrl()}/auth/signUp`, {
            method: "post",
            body: body,
            headers: {
                "Content-Type": "application/json"
            },
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            router.push('/auth/login');
        }
        else {
            setMessageWithType(jsonData.message, "error")
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!isValidEmail(email) ? true : false}

                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={username.trim() == "" ? true : false}

                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />

                    <FormControl sx={{ mt: 2, mb: 2, display: 'flex', }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={password.trim() == "" ? true : false}

                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    {(alertMessage != "") &&
                        <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
                    }

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign up
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/auth/login" variant="body2">
                                {"Already have an account? Login"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}

export default SignUpForm
