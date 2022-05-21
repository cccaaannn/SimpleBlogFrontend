import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Grid, TextField, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { AuthUtils } from '../../utils/auth-utils';
import { Storage } from '../../utils/storage';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../AlertMessage';


const UpdateAccountForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

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

        const response = await fetch(`${ApiUtils.getApiUrl()}/users/update/${AuthUtils.getTokenPayload().id}`, {
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
            setMessageWithType("Changes will be effective on next login", "success");
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }
    }


    return (
        <Container component="main" sx={{
            marginTop: 8,
        }}>
            <Grid container spacing={0} >
                <Grid item xs={12} sx={{ mb: 2 }}>
                    <Typography gutterBottom variant="h4" component="div">
                        Account information
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={username.trim() == "" ? true : false}
                        required
                        label="username"
                        sx={{ mr: 2, display: 'flex' }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Tooltip title="Leave empty to keep same">
                        <TextField
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="password"
                            placeholder='Leave empty to keep same'
                            type='password'
                            sx={{ display: 'flex' }}
                        />
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
                </Grid>
                <Grid item xs={11}>

                </Grid>
                <Grid item xs={1}>
                    <Button
                        onClick={onUserUpdate}
                        variant="contained"
                        size="large"
                        sx={{ mt: 1, mb: 1, float: 'right' }}
                    >
                        Update
                    </Button>
                </Grid>
                <Grid item xs={12}>

                </Grid>
            </Grid>

        </Container >

    )
}

export default UpdateAccountForm
