import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { cyan } from '@mui/material/colors';
import { Alert, Avatar, Button, CardActions, CardHeader, TextareaAutosize, Zoom } from '@mui/material';

// Do NOT import all of the folder, ssr times out
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import CloseIcon from '@mui/icons-material/Close';

import { Storage } from '../../../utils/storage';
import { LocalStorageKeys } from '../../../types/enums/local-storage-keys';
import { DateUtils } from '../../../utils/date-utils';
import { ApiUtils } from '../../../utils/api-utils'
import { AuthUtils } from '../../../utils/auth-utils';
import useAlertMessage from '../../../hooks/useAlertMessage';
import useSSRDetector from '../../../hooks/useSSRDetector';


const Post = ({ postProp, referer }: any) => {
    const router = useRouter();
    const paths = router.asPath.split("/");;
    const postId = paths[paths.length - 1];

    const [post, setPost] = useState(postProp);
    const [comment, setComment] = useState("");

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    const [isSSR] = useSSRDetector();

    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";
        console.log("CSR");
        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${postId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        setPost(jsonData.data);
    }

    useEffect(() => {
        if (post == null) {
            fetchData();
        }
    }, [])

    const getPostWhenDefined = () => {
        if (post != null) {
            return (
                <Card sx={{ minWidth: 700, maxWidth: 700 }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: cyan[500] }} aria-label="username">
                                {post.owner.username.charAt(0)}
                            </Avatar>
                        }

                        title={
                            <Button sx={{ padding: 0, textTransform: 'none' }} href={'/users/' + post.owner._id}>{post.owner.username}</Button>
                        }
                        subheader={post.dateCreated ? DateUtils.toLocalDateString(post.dateCreated) : ""}
                    // action={

                    // }
                    >
                    </CardHeader>


                    <CardMedia
                        component="img"
                        sx={{ maxWidth: '%100', maxHeight: 200 }}
                        image={post.image}
                        onError={(e: any) => e.target.src = "http://via.placeholder.com/300"}
                        alt={post.header + "image"}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {post.header}
                        </Typography>

                        <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2" color="text.secondary" component="p">
                            {post.body}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" href='/home'><ChevronLeftRounded /> Go Back</Button>
                    </CardActions>
                </Card>
            )
        }
    }

    const getCommentsWhenDefined = () => {
        if (post != null) {
            let userId: any = null;
            if (!isSSR && AuthUtils.isLoggedIn()) {
                userId = AuthUtils.getTokenPayload().id;
            }

            return post.comments.map((comment: any, key: any) => {
                return (
                    <Card sx={{ minWidth: 700, maxWidth: 700, mb: 2 }} key={comment._id}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: cyan[500] }} aria-label="username">
                                    {post.owner.username.charAt(0)}
                                </Avatar>
                            }

                            title={
                                <Button sx={{ padding: 0, textTransform: 'none' }} href={'/users/' + comment.owner._id}>{comment.owner.username}</Button>
                            }
                            subheader={comment.dateCreated ? DateUtils.toLocalDateString(comment.dateCreated) : ""}
                            action={
                                userId == comment.owner._id &&
                                (
                                    <IconButton onClick={() => onCommentDelete(comment._id)}>
                                        <CloseIcon />
                                    </IconButton>
                                )
                            }
                        >
                        </CardHeader>
                        <CardContent>
                            <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2" color="text.secondary" component="p">
                                {comment.comment}
                            </Typography>
                        </CardContent>
                    </Card>
                )
            })
        }
    }


    const onCommentDelete = async (commentId: any) => {
        const response = await fetch(`${ApiUtils.getApiUrl()}/posts/removeComment/${postId}/${commentId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Storage.get(LocalStorageKeys.TOKEN)}`
            },
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setMessageWithType("Comment removed", "success");
            fetchData();
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }
    }

    const onCommentPost = async () => {
        if (comment.trim() == "") {
            setMessageWithType("Please write a comment", "error");
            return;
        }

        const body = JSON.stringify({
            comment: comment
        });

        const response = await fetch(`${ApiUtils.getApiUrl()}/posts/addComment/${postId}`, {
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
            setMessageWithType("Comment added", "success");
            fetchData();
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }

    }


    const addCommentBox = () => {
        if (!isSSR && AuthUtils.isLoggedIn()) {
            return (
                <>
                    <Typography gutterBottom variant="h6" component="div">
                        Add comment
                    </Typography>
                    <TextareaAutosize
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        aria-label="Comment area"
                        placeholder="Comment"
                        style={{ minWidth: 700, maxWidth: 700, minHeight: 100 }}
                    />
                    <Button
                        onClick={onCommentPost}
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        send
                    </Button>
                </>
            )
        }
        else {
            return (
                <>
                    <Typography gutterBottom variant="h6" component="div">
                        Add comment
                    </Typography>
                    <TextareaAutosize
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        aria-label="Comment area"
                        placeholder="Comment"
                        style={{ minWidth: 700, maxWidth: 700, minHeight: 100 }}
                    />
                    <Link href="/auth/login" variant="body2">
                        Login to add comment.
                    </Link>
                </>
            )
        }
    }


    return (
        <>
            <Head>
                <meta property="og:url" content={referer} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={postProp != null ? postProp.header as any : ""} />
                <meta property="og:description" content={postProp != null ? postProp.body.slice(0, 100) + "..." as any : ""} />
                <meta property="og:image" content={postProp != null ? postProp.image as any : ""} />
            </Head>

            <Container component="main" sx={{
                marginTop: 8,
                marginBottom: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <CssBaseline />
                {getPostWhenDefined()}

                <br />
                <Typography gutterBottom variant="h5" component="div">
                    Comments
                </Typography>
                <br />

                {getCommentsWhenDefined()}

                <Zoom in={alertMessage == "" ? false : true} style={{ minWidth: 700, maxWidth: 700 }}>
                    <Alert severity={alertType} onClose={() => { setMessageWithType("") }}>{alertMessage}</Alert>
                </Zoom>

                {addCommentBox()}

                <br /> <br /> <br />
            </Container>
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${context.params.id}`)
    const jsonData: any = await response.json();

    return {
        props: {
            postProp: jsonData.data,
            referer: context.req.headers.referer ? context.req.headers.referer : ""
        },
    }
}

export default Post
