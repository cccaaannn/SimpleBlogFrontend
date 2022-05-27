/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button, Grid } from '@mui/material';

import { LocalStorageKeys } from '../../../../types/enums/local-storage-keys';
import { CategoryArrWithoutAll } from '../../../../types/enums/Category';
import { VisibilityArr } from '../../../../types/enums/Visibility';
import { AuthUtils } from '../../../../utils/auth-utils';
import { ApiUtils } from '../../../../utils/api-utils';
import { Storage } from '../../../../utils/storage';
import useAlertMessage from '../../../../hooks/useAlertMessage';
import AlertMessage from '../../../../components/AlertMessage';
import ComboBox from '../../../../components/ComboBox';


const EditPost: NextPage = () => {

    // next
    const router = useRouter();

    // react
    const [newPostHeader, setNewPostHeader] = useState("");
    const [newPostBody, setNewPostBody] = useState("");
    const [newPostImage, setNewPostImage] = useState("");
    const [newPostCategory, setNewPostCategory] = useState("General");
    const [newPostVisibility, setNewPostVisibility] = useState("public");

    // custom
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    useEffect(() => {
        fillPostDetail();
    }, [])

    const fillPostDetail = async () => {
        const paths = router.asPath.split("/");
        const postId = paths[paths.length - 1];

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${postId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Storage.get(LocalStorageKeys.TOKEN)}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        if (!jsonData.status) {
            console.log("SV is dead");
            return;
        }

        setNewPostHeader(jsonData.data.header)
        setNewPostBody(jsonData.data.body)
        setNewPostImage(jsonData.data.image)
        setNewPostCategory(jsonData.data.category)
        setNewPostVisibility(jsonData.data.visibility)
    }

    const onPosteEdit = async () => {

        if (newPostHeader.trim() == "" || newPostBody.trim() == "" || newPostImage.trim() == "") {
            setMessageWithType("Please fill required fields", "warning");
            return;
        }

        const paths = router.asPath.split("/");
        const postId = paths[paths.length - 1];

        const body = JSON.stringify({
            header: newPostHeader,
            body: newPostBody,
            image: newPostImage,
            category: newPostCategory,
            visibility: newPostVisibility
        });


        const response = await fetch(`${ApiUtils.getApiUrl()}/posts/update/${postId}`, {
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
            setMessageWithType("Post updated", "success");
            router.push(`/users/${AuthUtils.getTokenPayload().id}/posts/${postId}`);
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

            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <Typography gutterBottom variant="h2" component="div">
                        Update post
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
                <Grid item xs={4} md={8}>
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

                <Grid item xs={4} md={2}>
                    <ComboBox
                        name='Category'
                        inputsList={CategoryArrWithoutAll}
                        selected={newPostCategory}
                        setSelected={setNewPostCategory}
                    />
                </Grid>
                <Grid item xs={4} md={2}>
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
                {(alertMessage != "") &&
                    <Grid item xs={12} sx={{ mt: 1 }}>
                        <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
                    </Grid>
                }
                <Grid item xs={6}>
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
                    <Button
                        onClick={onPosteEdit}
                        variant="contained"
                        size="large"
                        sx={{ mt: 1, mb: 1, float: 'right' }}
                    >
                        Update!
                    </Button>
                </Grid>
            </Grid >

        </Container >
    )
}

export default EditPost
