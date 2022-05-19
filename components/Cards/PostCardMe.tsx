import { useRouter } from 'next/router';
import { useState } from 'react';

import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import DeleteIcon from '@mui/icons-material/Delete';
import { cyan } from '@mui/material/colors';

import { Post } from "../../types/Post";
import { DateUtils } from "../../utils/date-utils";
import ConfirmDialog from '../ConfirmDialog';


interface PostCardHomeProps {
    post: Post,
    onDelete: any
}

export default function PostCardMe({ post, onDelete }: PostCardHomeProps) {
    const router = useRouter();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const onEdit = (postId: string) => {
        router.push(`me/edit-post/${postId}`);
    }

    const onReadMore = (postId: string) => {
        router.push(`/posts/${postId}`);
    }

    const deleteAndClose = async (postId: string) => {
        onDelete(postId);
        setDeleteConfirmOpen(false);
    }

    return (
        <div key={post._id}>
            <ConfirmDialog open={deleteConfirmOpen} setOpen={setDeleteConfirmOpen} onConfirm={() => deleteAndClose(post._id)} text={`${post.header}`} title={`You sure want to delete`} />

            <Card sx={{ display: 'flex', minWidth: 600, maxWidth: 700, marginBottom: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 550 }}>
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
                        action={
                            <IconButton onClick={() => setDeleteConfirmOpen(true)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                    </CardHeader>
                    <CardContent sx={{ flex: '1 0 auto', paddingTop: 0 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {post.header}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {post.body.length < 300 ? post.body : post.body.slice(0, 300) + "..."}
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        <Button size="small" onClick={() => onEdit(post._id)}>Edit <EditIcon /></Button>

                        <Button size="small" onClick={() => onReadMore(post._id)}>Go to post<ChevronRightRounded /></Button>
                    </Box>
                </Box>

                <CardMedia
                    component="img"
                    sx={{ width: 170 }}
                    image={post.image}
                    onError={(e: any) => e.target.src = "http://via.placeholder.com/300"}
                    alt={post.header + "image"}
                />
            </Card>
        </div>

    );
}