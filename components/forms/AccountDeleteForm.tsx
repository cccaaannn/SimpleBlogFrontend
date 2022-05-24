import { useState } from 'react';

import { Button, Grid, Typography } from "@mui/material";

import { LocalStorageKeys } from "../../types/enums/local-storage-keys";
import { AuthUtils } from "../../utils/auth-utils";
import AccountDeleteConfirmDialog from "../AccountDeleteConfirmDialog";
import { Storage } from '../../utils/storage';
import { ApiUtils } from '../../utils/api-utils';


const AccountDeleteForm = () => {

    const [open, setOpen] = useState(false);

    const onDeleteAccount = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN);

        const id = AuthUtils.isLoggedIn() ? AuthUtils.getTokenPayload().id : "";

        const res = await fetch(`${ApiUtils.getApiUrl()}/users/purge/${id}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        console.log(res);
        
        const jsonData: any = await res.json();
        console.log(jsonData);

        AuthUtils.logout();
        window.location = "/home" as any;
    }

    return (
        <>
            <AccountDeleteConfirmDialog
                open={open}
                setOpen={setOpen}
                onConfirm={() => onDeleteAccount()}
            />
            <Grid container spacing={0} sx={{ mt: 4, mb: 4 }} >
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h4" component="div">
                            Delete account
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="subtitle1" component="p">
                            Permanently delete your account with all of your posts and comments.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <br />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setOpen(true)}
                            sx={{ float: "right" }}
                        >
                            Delete account
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default AccountDeleteForm