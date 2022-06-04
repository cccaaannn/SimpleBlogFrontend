/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';

import { ApiService } from '../../../../../services/api-service';
import { StaticPaths } from '../../../../../utils/static-paths';
import { ApiUtils } from '../../../../../utils/api-utils'
import PostCardDetail from '../../../../../components/Cards/PostCardDetail';
import AddCommentForm from '../../../../../components/forms/AddCommentForm';
import CommentCard from '../../../../../components/Cards/CommentCard';
import useAlertMessage from '../../../../../hooks/useAlertMessage';
import AlertMessage from '../../../../../components/AlertMessage';
import OpenGraph from '../../../../../components/OpenGraph';


const Post: NextPage = ({ ssrPost, referer }: any) => {

    // next
    const router = useRouter();

    // react
    const [post, setPost] = useState(ssrPost);
    const [loading, setLoading] = useState(true);

    const [comment, setComment] = useState("");

    // custom
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();


    const postId = router.asPath.split("/").pop();


    useEffect(() => {
        if (post == null) {
            fetchData();
        }
        else {
            setLoading(false);
        }
    }, [])

    const fetchData = async () => {
        setLoading(true);

        console.log("CSR");
        const res = await ApiService.get(`/posts/getById/${postId}`);
        const jsonData: any = await res.json();
        console.log(jsonData);

        if (jsonData.status) {
            setPost(jsonData.data);
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }

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
        const response = await ApiService.put(`/posts/removeComment/${postId}/${commentId}`);

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
            setMessageWithType("Please write a comment", "warning");
            return;
        }

        const body = JSON.stringify({
            comment: comment
        });

        const response = await ApiService.put(`/posts/addComment/${postId}`, {
            body: body
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

    const onLikeAdd = async () => {
        const response = await ApiService.put(`/posts/addLike/${postId}`);

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            fetchData();
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }
    }

    const onLikeRemove = async () => {
        const response = await ApiService.put(`/posts/removeLike/${postId}`);

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
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
                    title={ssrPost != null ? ssrPost.header as any : "Simple Blog"}
                    description={ssrPost != null ? ssrPost.body.slice(0, 100) + "..." as any : "Join and share your posts."}
                    image={ssrPost != null ? ssrPost.image as any : StaticPaths.ICON_100}
                />
            </Head>
            <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
            <Grid container spacing={1} >
                <Grid item xs={12} md={12}>
                    <PostCardDetail
                        post={post}
                        onLike={() => onLikeAdd()}
                        onUnLike={() => onLikeRemove()}
                        loading={loading}
                    />
                </Grid>
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
        </>
    )
}


export const getServerSideProps = async (context: any) => {
    const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${context.params.postId}`)
    const jsonData: any = await response.json();

    return {
        props: {
            ssrPost: jsonData.data,
            referer: context.req.headers.referer ? context.req.headers.referer : ""
        },
    }
}


export default Post
