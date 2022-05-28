import { useRouter } from 'next/router';

import * as React from 'react';
import { useState } from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { IconButton, Menu, MenuItem } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import useBreakpointDetector from '../hooks/useBreakpointDetector';
import { TokenPayload } from '../types/TokenPayload';
import useSSRDetector from '../hooks/useSSRDetector';
import { AuthUtils } from '../utils/auth-utils';
import Roles from '../types/enums/Roles';


export default function Navbar({ selectedTheme, setSelectedTheme }: any) {

    const router = useRouter();
    const isSSR = useSSRDetector();
    const isMobile = useBreakpointDetector('md');
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const onLogout = () => {
        AuthUtils.logout();
        setAnchorElUser(null);
        router.replace("/home");
    }

    const onAccount = () => {
        setAnchorElUser(null);
        router.push("/me");
    }

    const onAdmin = () => {
        setAnchorElUser(null);
        router.push("/admin");
    }

    const onThemeChange = () => {
        if (selectedTheme == "light") {
            setSelectedTheme("dark");
        }
        else {
            setSelectedTheme("light");
        }
    }

    const getButtons = () => {
        if (isSSR) {
            return (<></>)
        }
        else if (!AuthUtils.isLoggedIn()) {
            return (
                <>
                    <IconButton sx={{ ml: 1 }} onClick={() => onThemeChange()} color="inherit">
                        {selectedTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <Button color="inherit" href='/auth/login'>Login</Button>
                    <Button color="inherit" href='/auth/sign-up'>Sign-up</Button>
                </>
            )
        }
        else {
            const tokenPayload: TokenPayload = AuthUtils.getTokenPayload();
            return (
                <>
                    <IconButton sx={{ ml: 1 }} onClick={() => onThemeChange()} color="inherit">
                        {selectedTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
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
                            {tokenPayload.role != Roles.USER &&
                                <MenuItem onClick={(e) => onAdmin()}>
                                    <Typography textAlign="center">
                                        Admin
                                    </Typography>
                                </MenuItem>
                            }
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
        <AppBar position={isMobile ? "sticky" : "static"}>
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

                {
                    !isMobile ?
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Button color="inherit" href='/home'>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    Simple blog
                                </Typography>
                            </Button>
                        </Typography>
                        :
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        </Typography>
                }

                {getButtons()}

            </Toolbar>
        </AppBar>
    );
}