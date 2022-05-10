import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom';
import { useRouter } from 'next/router';
import { Storage } from '../../utils/storage';
import { useEffect, useState } from 'react';
import { Alert, AlertColor } from '@mui/material';
import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import Copyright from '../../components/Copyright';
import { isValidEmail } from '../../utils/email-validation';
import { ApiUtils } from '../../utils/api-utils';


export default function ResetPassword() {

    const isPasswordsMatching = (password1: string, password2: string) => {
        if (password1 == "" || password2 == "") {
            return false;
        }

        if (password1 !== password2) {
            return false;
        }

        return true;
    }

    const theme = createTheme();

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info" as AlertColor);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isPasswordsMatching(password1, password2)) {
            setAlertType("error" as AlertColor);
            setAlertMessage("Passwords are not matching.");
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
            setAlertType("success" as AlertColor);
            setAlertMessage(jsonData.message);
        }
        else {
            setAlertType("error" as AlertColor);
            setAlertMessage(jsonData.message);
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

                        <Zoom in={alertMessage == "" ? false : true}>
                            <Alert severity={alertType} onClose={() => { setAlertMessage("") }}>{alertMessage}</Alert>
                        </Zoom>

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
        </ThemeProvider>
    );
}