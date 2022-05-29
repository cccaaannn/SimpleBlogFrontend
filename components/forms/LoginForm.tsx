/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Copyright from '../../components/Copyright';
import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { Storage } from '../../utils/storage';
import useAlertMessage from '../../hooks/useAlertMessage';
import { AuthUtils } from '../../utils/auth-utils';
import AlertMessage from '../../components/AlertMessage';
import { ApiService } from '../../services/api-service';


const LoginForm = () => {

    const router = useRouter();

    const { executeRecaptcha } = useGoogleReCaptcha();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            router.push('/home');
        }

        const rememberMeUsername: string | null = Storage.get(LocalStorageKeys.REMEMBER_ME);
        if (rememberMeUsername != null) {
            setUsername(rememberMeUsername);
            setRememberMe(true);
        }
    }, [])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (username.trim() == "" || password.trim() == "") {
            setMessageWithType("Please fill required fields", "error")
            return;
        }

        // If recaptcha is not ready
        if (!executeRecaptcha) {
            setMessageWithType("Recaptcha is not available", "error")
            return;
        }

        const token = await executeRecaptcha('login');

        const body = JSON.stringify({
            username: username,
            password: password,
            captcha: token
        });

        const response = await ApiService.fetcher(`/auth/login`, {
            method: "post",
            body: body
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            if (rememberMe) {
                Storage.set(LocalStorageKeys.REMEMBER_ME, username);
            }
            else {
                Storage.clear(LocalStorageKeys.REMEMBER_ME);
            }

            setMessageWithType("Welcome", "success")

            Storage.set(LocalStorageKeys.TOKEN, jsonData.data.token);
            router.push('/home');
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
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={password.trim() == "" ? true : false}

                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox onClick={() => setRememberMe(!rememberMe)} checked={rememberMe} color="primary" />}
                        label="Remember me"
                    />

                    {(alertMessage != "") &&
                        <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
                    }

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/auth/forgot-password" variant="body2">
                                Can not login?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/auth/sign-up" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    )
}

export default LoginForm
