import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Storage } from '../../../../../utils/storage';
import { LocalStorageKeys } from '../../../../../types/enums/local-storage-keys';
import { ApiUtils } from '../../../../../utils/api-utils'
import useAlertMessage from '../../../../../hooks/useAlertMessage';
import PostCardDetail from '../../../../../components/Cards/PostCardDetail';
import OpenGraph from '../../../../../components/OpenGraph';
import AlertMessage from '../../../../../components/AlertMessage';
import CommentCard from '../../../../../components/Cards/CommentCard';
import AddCommentForm from '../../../../../components/forms/AddCommentForm';
import { Divider, Grid } from '@mui/material';


const Post = ({ postProp, referer }: any) => {
    const router = useRouter();
    const postId = router.asPath.split("/").pop();

    const [post, setPost] = useState(postProp);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    useEffect(() => {
        if (post == null) {
            fetchData();
        }
        else {
            setLoading(false);
        }

        // eslint-disable-next-line
    }, [])

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
        setLoading(false);
    }


    const mapComments = () => {
        const comments: any[] = []
        post.comments.map((comment: any, key: any) => {
            comments.push(<CommentCard comment={comment} onDelete={onCommentDelete} loading={loading} key={key} />)
        })
        return comments
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
            setComment("");
            fetchData();
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }

    }


    return (
        <>
            <Head>
                <OpenGraph
                    url={referer}
                    title={postProp != null ? postProp.header as any : ""}
                    description={postProp != null ? postProp.body.slice(0, 100) + "..." as any : ""}
                    image={postProp != null ? postProp.image as any : ""}
                />
            </Head>

            <Container component="main" maxWidth="lg" sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Grid container spacing={1} >
                    <Grid item xs={12} md={12}>
                        <PostCardDetail post={post} loading={loading} />
                    </Grid>
                    {(alertMessage != "") &&
                        <Grid item xs={12} md={12}>
                            <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
                        </Grid>
                    }
                    <Grid item xs={12} md={12}>
                        <Container component="main" sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 2
                        }}>
                            <Typography gutterBottom variant="h5" component="div">
                                Comments
                            </Typography>
                        </Container>

                        {post != null ? mapComments() : ""}

                    </Grid>
                    <Grid item xs={12} md={12}>
                        <AddCommentForm comment={comment} setComment={setComment} onPost={onCommentPost} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${context.params.postId}`)
    const jsonData: any = await response.json();

    return {
        props: {
            postProp: jsonData.data,
            referer: context.req.headers.referer ? context.req.headers.referer : ""
        },
    }
}

export default Post
