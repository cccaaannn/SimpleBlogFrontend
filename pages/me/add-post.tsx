import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import { Alert, Button, TextareaAutosize, Zoom } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { AuthUtils } from '../../utils/auth-utils';
import { Storage } from '../../utils/storage';
import useAlertMessage from '../../hooks/useAlertMessage';
import { CategoryArr, CategoryArrWithoutAll } from '../../types/enums/Category';
import { VisibilityArr } from '../../types/enums/Visibility';
import ComboBox from '../../components/ComboBox';


const AddPost = () => {
    const router = useRouter();

    const [newPostHeader, setNewPostHeader] = useState("");
    const [newPostBody, setNewPostBody] = useState("");
    const [newPostImage, setNewPostImage] = useState("");
    const [newPostCategory, setNewPostCategory] = useState("General");
    const [newPostVisibility, setNewPostVisibility] = useState("public");

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    const onBack = () => {
        router.push(`/home`);
    }

    useEffect(() => {
        if (!AuthUtils.isLoggedIn()) {
            router.push(`/home`);
        }
    }, [])


    const onPostAdd = async (commentId: any) => {

        if (newPostHeader.trim() == "" || newPostBody.trim() == "" || newPostImage.trim() == "") {
            setMessageWithType("Please fill empty fields", "error");
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
            router.push(`/home`);
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
                Add post
            </Typography>
            <TextField
                value={newPostHeader}
                onChange={(e) => setNewPostHeader(e.target.value)}
                error={newPostHeader.trim() == "" ? true : false}
                required
                label="Title"
            />

            <TextField
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
                error={newPostImage.trim() == "" ? true : false}
                required
                label="Image url"
            />

            <TextareaAutosize
                value={newPostBody}
                onChange={(e) => setNewPostBody(e.target.value)}
                aria-label="Post area"
                placeholder="Post body"
                style={{ minWidth: 700, maxWidth: 700, minHeight: 100 }}
            />

            <ComboBox
                name='Category'
                inputsList={CategoryArrWithoutAll}
                selected={newPostCategory}
                setSelected={setNewPostCategory}
            />

            <ComboBox
                name='Visibility'
                inputsList={VisibilityArr}
                selected={newPostVisibility}
                setSelected={setNewPostVisibility}
            />

            <Button
                onClick={onPostAdd}
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                Post
            </Button>


            <Zoom in={alertMessage == "" ? false : true} style={{ minWidth: 700, maxWidth: 700 }}>
                <Alert severity={alertType} onClose={() => { setMessageWithType("") }}>{alertMessage}</Alert>
            </Zoom>

        </Container >

    )
}

export default AddPost
