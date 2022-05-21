import { useRouter } from 'next/router';

import * as React from 'react';
import { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconButton, Menu, MenuItem, MenuList } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

import { AuthUtils } from '../utils/auth-utils';
import { TokenPayload } from '../types/TokenPayload';
import useSSRDetector from '../hooks/useSSRDetector';


export default function Navbar() {

    const router = useRouter();
    const [isSSR] = useSSRDetector();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const onLogout = () => {
        AuthUtils.logout();
        setAnchorElUser(null);
        window.location.href = "/home";
    }

    const onAccount = () => {
        setAnchorElUser(null);
        router.push("/me");
    }

    const getButtons = () => {
        if(isSSR) {
            return (<></>)
        }
        else if (!AuthUtils.isLoggedIn()) {
            return (
                <>
                    <Button color="inherit" href='/auth/login'>Login</Button>
                    <Button color="inherit" href='/auth/sign-up'>Sign-up</Button>
                </>
            )
        }
        else {
            const tokenPayload: TokenPayload = AuthUtils.getTokenPayload();
            return (
                <>
                    <Box sx={{ flexGrow: 0 }}>
                        <Button color="inherit" onClick={(event) => setAnchorElUser(event.currentTarget)} >{tokenPayload.username}</Button>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={(e) => setAnchorElUser(null)}
                        >
                            <MenuItem onClick={(e) => onAccount()}>
                                <Typography textAlign="center">
                                    Account
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={(e) => onLogout()}>
                                <Typography textAlign="center">
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </>
            )
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        href='/home'
                        sx={{ mr: 2 }}
                    >
                        <ArticleIcon fontSize="large" />
                    </IconButton>

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