import { useRouter } from 'next/router'

import { useState } from 'react';

import { Button, Grid, Typography } from "@mui/material";

import AccountDeleteConfirmDialog from "../AccountDeleteConfirmDialog";
import { ApiService } from '../../services/api-service';
import { AuthUtils } from "../../utils/auth-utils";
import { Storage } from '../../utils/storage';


const AccountDeleteForm = () => {
    
    // next
    const router = useRouter();

    // react
    const [open, setOpen] = useState(false);

    const onDeleteAccount = async () => {
        const id = AuthUtils.isLoggedIn() ? AuthUtils.getTokenPayload().id : "";

        const response = await ApiService.delete(`/users/purge/${id}`);

        const jsonData: any = await response.json();
        console.log(jsonData);

        AuthUtils.logout();
        router.replace("/home");
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