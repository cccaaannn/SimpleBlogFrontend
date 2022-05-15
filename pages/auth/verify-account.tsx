import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, AlertColor } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';

import Copyright from '../../components/Copyright';
import { ApiUtils } from '../../utils/api-utils';
import useAlertMessage from '../../hooks/useAlertMessage';
import { AuthUtils } from '../../utils/auth-utils';


export default function VerifyAccount() {
    const router = useRouter();
    const theme = createTheme();

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            router.push('/home');
        }

        if (router.query.token && router.query.token != null) {
            verifyAccount();
        }
    }, [router.query.token])

    const verifyAccount = async () => {
        const { token } = router.query;
        console.log(token);

        const body: string = JSON.stringify({
            token: token
        });

        const response = await fetch(`${ApiUtils.getApiUrl()}/auth/verifyAccount`, {
            method: "post",
            body: body,
            headers: {
                "Content-Type": "application/json"
            },
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setMessageWithType(jsonData.message, "success")
        }
        else {
            setMessageWithType(jsonData.message, "error" )
        }
    }

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
                        Activate account
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>

                        <Zoom in={alertMessage == "" ? false : true}>
                            <Alert severity={alertType} onClose={() => { setMessageWithType("") }}>{alertMessage}</Alert>
                        </Zoom>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/auth/login" variant="body2">
                                    Login
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/auth/send-verification" variant="body2">
                                    {"Re-send activation mail"}
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