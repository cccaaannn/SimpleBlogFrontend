import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AuthUtils } from '../utils/auth-utils';
import { TokenPayload } from '../types/TokenPayload';
import { useRouter } from 'next/router';
import useSSRDetector from '../hooks/useSSRDetector';


export default function Navbar() {
    const router = useRouter();

    const [isSSR] = useSSRDetector();

    const getButtons = () => {
        if (isSSR || !AuthUtils.isLoggedIn()) {
            return (
                <>
                    <Button color="inherit" href='/auth/login'>Login</Button>
                    <Button color="inherit" href='/auth/sign-up'>Sign-up</Button>
                </>
            )
        }
        else {
            const tokenPayload: TokenPayload = AuthUtils.getTokenPayload();
            console.log(tokenPayload);
            
            return (
                <>
                    <Button color="inherit" href='/me'>{tokenPayload.username}</Button>
                    <Button color="inherit" onClick={() => onLogout()}>Logout</Button>
                </>
            )
        }
    }

    const onLogout = () => {
        AuthUtils.logout();
        window.location.href = "/home";
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Button color="inherit" href='/home'>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Simple blog
                            </Typography>
                        </Button>
                    </Typography>

                    {getButtons()}

                </Toolbar>
            </AppBar>
        </Box>
    );
}