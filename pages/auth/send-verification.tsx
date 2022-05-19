import * as React from 'react';
import { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ApiUtils } from '../../utils/api-utils';
import { isValidEmail } from '../../utils/email-validation';
import Copyright from '../../components/Copyright';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../../components/AlertMessage';


export default function SendVerification() {
    const theme = createTheme();

    const [email, setEmail] = useState("");
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidEmail(email)) {
            setMessageWithType("Please enter a valid email", "error")
            return;
        }

        const response = await fetch(`${ApiUtils.getApiUrl()}/auth/sendAccountVerification/${email}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            },
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
        <ThemeProvider theme={theme}>
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
                         Send account activation link
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            sx={{mr:20}} 
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

                        <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />

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
						</Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}