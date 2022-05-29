import * as React from 'react';
import { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { isValidEmail } from '../../utils/email-validation';
import { ApiService } from '../../services/api-service';
import { ApiUtils } from '../../utils/api-utils';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../../components/AlertMessage';
import Copyright from '../../components/Copyright';


export default function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidEmail(email)) {
            setMessageWithType("Please enter a valid email", "error")
            return;
        }

        const response = await ApiService.fetcher(`/auth/sendPasswordReset/${email}`, {
            method: "get"
        });
        const jsonData = await response.json();
        console.log(jsonData);


        if (response.status > 500) {
            setMessageWithType(jsonData.message, "error")
        }
        else {
            setEmail("");
            setMessageWithType("Email sent.", "success")
        }

    };

    return (
        <Container component="main">
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
                    Reset password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!isValidEmail(email) ? true : false}

                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="email"
                        type="email"
                        id="email"
                        autoComplete="current-email"
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
                        Send
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/auth/login" variant="body2">
                                Login
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/auth/send-verification" variant="body2">
                                {"Activate account"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}