import * as React from 'react';
import { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, AlertColor, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';

import Copyright from '../../components/Copyright';
import { ApiUtils } from '../../utils/api-utils';
import { isValidEmail } from '../../utils/email-validation';
import useAlertMessage from '../../hooks/useAlertMessage';


export default function ForgotPassword() {

    const theme = createTheme();

    const [email, setEmail] = useState("");
	const [alertMessage, setAlertMessage, alertType, setAlertType] = useAlertMessage();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidEmail(email)) {
            setAlertType("error" as AlertColor);
            setAlertMessage("Please enter a valid email");
            return;
        }

        const response = await fetch(`${ApiUtils.getApiUrl()}/auth/sendPasswordReset/${email}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const jsonData = await response.json();
        console.log(jsonData);


        if (response.status > 500) {
            setAlertType("error" as AlertColor);
            setAlertMessage(jsonData.message);
        }
        else {
            setEmail("");
            setAlertType("success" as AlertColor);
            setAlertMessage("Email sent.");    
        }

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
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

                        <Zoom in={alertMessage == "" ? false : true}>
                            <Alert severity={alertType} onClose={() => { setAlertMessage("") }}>{alertMessage}</Alert>
                        </Zoom>

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
									{"Have inactive account? Activate account"}
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