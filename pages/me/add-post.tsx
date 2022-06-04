/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next'

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';

import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button, Grid } from '@mui/material';

import { CategoryArrWithoutAll } from '../../types/enums/Category';
import { VisibilityArr } from '../../types/enums/Visibility';
import { ApiService } from '../../services/api-service';
import { AuthUtils } from '../../utils/auth-utils';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../../components/AlertMessage';
import ComboBox from '../../components/ComboBox';


const AddPost: NextPage = () => {

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


        const response = await ApiService.post(`/posts/add`, {
            body: body
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
        <>
            <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
            <Grid container spacing={2} >
                <Grid item xs={12}>
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
                        onClick={onPostAdd}
                        variant="contained"
                        size="large"
                        sx={{ mt: 1, mb: 1, float: 'right' }}
                    >
                        Post!
                    </Button>
                </Grid>
            </Grid >
        </>
    )
}

export default AddPost
