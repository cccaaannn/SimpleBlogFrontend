import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';

import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { AuthUtils } from '../../utils/auth-utils';
import { Storage } from '../../utils/storage';
import useAlertMessage from '../../hooks/useAlertMessage';
import { CategoryArrWithoutAll } from '../../types/enums/Category';
import { VisibilityArr } from '../../types/enums/Visibility';
import ComboBox from '../../components/ComboBox';
import AlertMessage from '../../components/AlertMessage';


const AddPost = () => {
    const router = useRouter();

    const [newPostHeader, setNewPostHeader] = useState("");
    const [newPostBody, setNewPostBody] = useState("");
    const [newPostImage, setNewPostImage] = useState("");
    const [newPostCategory, setNewPostCategory] = useState("General");
    const [newPostVisibility, setNewPostVisibility] = useState("public");

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();


    useEffect(() => {
        if (!AuthUtils.isLoggedIn()) {
            router.push(`/home`);
        }
    }, [])


    const onPostAdd = async () => {

        if (newPostHeader.trim() == "" || newPostBody.trim() == "" || newPostImage.trim() == "") {
            setMessageWithType("Please fill required fields", "warning");
            return;
        }

        const body = JSON.stringify({
            header: newPostHeader,
            body: newPostBody,
            image: newPostImage,
            category: newPostCategory,
            visibility: newPostVisibility
        });


        const response = await fetch(`${ApiUtils.getApiUrl()}/posts/add`, {
            method: "post",
            body: body,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Storage.get(LocalStorageKeys.TOKEN)}`
            },
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setMessageWithType("Post added", "success");
            router.push(`/users/${AuthUtils.getTokenPayload().id}/posts/${jsonData.data._id}`);
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }
    }

    return (
        <Container component="main" sx={{
            marginTop: 2,
            padding: 2,
            boxShadow: 3
        }}>

            <Grid container spacing={0} >
                <Grid item xs={12} sx={{ mb: 2 }}>
                    <Typography gutterBottom variant="h2" component="div">
                        Create a new post
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={newPostHeader}
                        onChange={(e) => setNewPostHeader(e.target.value)}
                        error={newPostHeader.trim() == "" ? true : false}
                        required
                        autoFocus
                        label="Post title"
                        placeholder="Title"
                        sx={{ mb: 2, display: 'flex' }}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        value={newPostImage}
                        onChange={(e) => setNewPostImage(e.target.value)}
                        error={newPostImage.trim() == "" ? true : false}
                        required
                        label="Post image"
                        placeholder="Image url"
                        sx={{ mb: 2, display: 'flex' }}
                    />
                </Grid>

                <Grid item xs={2}>
                    <ComboBox
                        name='Category'
                        inputsList={CategoryArrWithoutAll}
                        selected={newPostCategory}
                        setSelected={setNewPostCategory}
                    />
                </Grid>
                <Grid item xs={2}>
                    <ComboBox
                        name='Visibility'
                        inputsList={VisibilityArr}
                        selected={newPostVisibility}
                        setSelected={setNewPostVisibility}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Post body"
                        multiline
                        required
                        rows={12}
                        value={newPostBody}
                        onChange={(e) => setNewPostBody(e.target.value)}
                        aria-label="Post area"
                        placeholder="Post"
                        error={newPostBody.trim() == "" ? true : false}
                        sx={{ display: 'flex' }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        size="large"
                        variant="outlined"
                        href='/me'
                        sx={{ mt: 1, mb: 1, float: 'left' }}
                    >
                        <ChevronLeftRounded /> Go Back
                    </Button>
                </Grid>
                <Grid item xs={6}>

                </Grid>
                <Grid item xs={3}>
                    <Button
                        onClick={onPostAdd}
                        variant="contained"
                        size="large"
                        sx={{ mt: 1, mb: 1, float: 'right' }}
                    >
                        Post!
                    </Button>
                </Grid>
            </Grid >

        </Container >
    )
}

export default AddPost
