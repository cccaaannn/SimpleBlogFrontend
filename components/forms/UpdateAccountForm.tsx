import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { AuthUtils } from '../../utils/auth-utils';
import { Storage } from '../../utils/storage';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../AlertMessage';


const UpdateAccountForm = () => {
    const router = useRouter();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    const onBack = () => {
        router.push(`/home`);
    }

    useEffect(() => {
        if (!AuthUtils.isLoggedIn()) {
            router.push(`/home`);
        }
        else {
            setUsername(AuthUtils.getTokenPayload().username);
        }
    }, [])


    const onUserUpdate = async () => {

        if (username.trim() == "") {
            setMessageWithType("Please fill empty fields", "error");
            return;
        }

        let body = "";
        if(password.trim() == "") {
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>

            <Typography gutterBottom variant="h6" component="div">
                Update account
            </Typography>

            <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={username.trim() == "" ? true : false}
                required
                label="username"
            />

            <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="password"
                placeholder='Leave empty to keep same'
                type='password'
            />

            <Button
                onClick={onUserUpdate}
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                send
            </Button>

            <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />

        </Container >

    )
}

export default UpdateAccountForm
