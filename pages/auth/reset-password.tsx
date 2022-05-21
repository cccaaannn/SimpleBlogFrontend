import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import Copyright from '../../components/Copyright';
import { ApiUtils } from '../../utils/api-utils';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../../components/AlertMessage';


export default function ResetPassword() {
    const router = useRouter();

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    const isPasswordsMatching = (password1: string, password2: string) => {
        if (password1 == "" || password2 == "") {
            return false;
        }

        if (password1 !== password2) {
            return false;
        }

        return true;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isPasswordsMatching(password1, password2)) {
            setMessageWithType("Passwords are not matching.", "error")
            return;
        }

        // Get token from url
        const { token } = router.query;

        const body: string = JSON.stringify({
            token: token,
            password: password1
        });

        const response = await fetch(`${ApiUtils.getApiUrl()}/auth/resetPassword`, {
            method: "post",
            body: body,
            headers: {
                "Content-Type": "application/json"
            },
        });
        const jsonData = await response.json();
        console.log(jsonData);


        if (jsonData.status) {
            setPassword1("");
            setPassword2("");
            setMessageWithType(jsonData.message, "success")
        }
        else {
            setMessageWithType(jsonData.message, "error")
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        error={!isPasswordsMatching(password1, password2) ? true : false}

                        margin="normal"
                        required
                        fullWidth
                        name="password1"
                        label="password"
                        type="password"
                        id="password1"
                        autoComplete="current-password"
                    />

                    <TextField
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        error={!isPasswordsMatching(password1, password2) ? true : false}

                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="re-password"
                        type="password"
                        id="password2"
                        autoComplete="current-password"
                    />

                    <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/auth/login" variant="body2">
                                Login
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}