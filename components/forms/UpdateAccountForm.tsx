import { useRouter } from 'next/router'

import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button, Grid, TextField, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';

import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { AuthUtils } from '../../utils/auth-utils';
import { Storage } from '../../utils/storage';


interface UpdateAccountFormProps {
    setMessageWithType: any
}

const UpdateAccountForm = ({ setMessageWithType }: UpdateAccountFormProps) => {
    
    // next
    const router = useRouter();

    // react
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        setUsername(AuthUtils.getTokenPayload().username);
    }, [])


    const onUserUpdate = async () => {

        if (username.trim() == "") {
            setMessageWithType("Please fill required fields", "warning");
            return;
        }

        let body = "";
        if (password.trim() == "") {
            body = JSON.stringify({
                username: username,
            });
        }
        else {
            body = JSON.stringify({
                username: username,
                password: password,
            });
        }

        const id = AuthUtils.isLoggedIn() ? AuthUtils.getTokenPayload().id : "";

        const response = await fetch(`${ApiUtils.getApiUrl()}/users/update/${id}`, {
            method: "put",
            body: body,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Storage.get(LocalStorageKeys.TOKEN)}`
            },
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setMessageWithType("Account updated", "success");
            AuthUtils.logout();
            router.replace("/home");
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }
    }


    return (
        <Grid container spacing={0} sx={{ mb: 4 }} >
            <Grid item xs={6} >
                <Grid item xs={12} >
                    <Typography gutterBottom variant="h4" component="h4">
                        Account information
                    </Typography>
                </Grid>
                <Grid item xs={12} >
                    <Typography gutterBottom variant="subtitle1" component="p">
                        Update your account information.
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="p">
                        Username
                    </Typography>
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={username.trim() == "" ? true : false}
                        required
                        label="username"
                        sx={{ mt: 1, mb: 2, display: 'flex' }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="p">
                        Password (Leave empty to keep same)
                    </Typography>
                    <Tooltip title="Leave empty to keep same">
                        <TextField
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="password"
                            placeholder='Leave empty to keep same'
                            type='text'
                            sx={{ mt: 1, mb: 2, display: 'flex' }}
                        />
                    </Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        onClick={onUserUpdate}
                        variant="contained"
                        size="large"
                        sx={{ float: 'right' }}
                    >
                        Update
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default UpdateAccountForm
