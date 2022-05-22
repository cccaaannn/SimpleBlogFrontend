import { useRouter } from 'next/router';
import { useState } from 'react';

import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Chip, IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import DeleteIcon from '@mui/icons-material/Delete';

import { Post } from "../../types/Post";
import { DateUtils } from "../../utils/date-utils";
import ConfirmDialog from '../ConfirmDialog';
import { StaticPaths } from '../../utils/static-paths';
import { AvatarUtils } from '../../utils/avatar-utils';
import SkeletonTextBody from '../SkeletonTextBody';


interface PostCardHomeProps {
    post: Post,
    onDelete: any,
    loading: boolean
}

export default function PostCardMe({ post, onDelete, loading }: PostCardHomeProps) {
    const router = useRouter();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const onEdit = (postId: string) => {
        router.push(`me/edit-post/${postId}`);
    }

    const onReadMore = (post: Post) => {
        router.push(`/users/${post.owner._id}/posts/${post._id}`);
    }

    const deleteAndClose = async (postId: string) => {
        onDelete(postId);
        setDeleteConfirmOpen(false);
    }

    return (
        <div key={post._id}>
            <ConfirmDialog open={deleteConfirmOpen} setOpen={setDeleteConfirmOpen} onConfirm={() => deleteAndClose(post._id)} text={`${post.header}`} title={`You sure want to delete this post`} />

            <Card sx={{ display: 'flex', minWidth: 600, maxWidth: 700, marginBottom: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 550 }}>
                    <CardHeader
                        avatar={
                            loading ?
                                <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                :
                                <Avatar {...AvatarUtils.getColorWithLetters(post.owner.username)} />
                        }

                        title={
                            loading ?
                                <Skeleton animation="wave" height={10} width="60%" style={{ marginBottom: 6 }} />
                                :
                                <Button sx={{ padding: 0, textTransform: 'none' }} href={'/users/' + post.owner._id}>{post.owner.username}</Button>
                        }
                        subheader={
                            loading ?
                                <Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }} />
                                :
                                post.dateCreated ? DateUtils.toLocalDateString(post.dateCreated) : ""
                        }
                        action={
                            loading ?
                                <Skeleton animation="wave" variant="rectangular" width={100} height={25} />
                                :
                                <>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => setDeleteConfirmOpen(true)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                        }
                    >
                    </CardHeader>
                    <CardContent sx={{ flex: '1 0 auto', paddingTop: 0 }}>
                        {loading ? (
                            <SkeletonTextBody lineCount={7} />
                        ) : (
                            <>
                                <Typography gutterBottom variant="h5" component="div">
                                    {post.header}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {post.body.length < 300 ? post.body : post.body.slice(0, 300) + "..."}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" component="div">
                                    <Tooltip title="Category">
                                        <Chip label={post.category} />
                                    </Tooltip>
                                    <Tooltip title="Visibility">
                                        <Chip label={post.visibility} variant="outlined" sx={{ float: 'right' }} />
                                    </Tooltip>
                                </Typography>
                            </>
                        )}
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        {loading ?
                            <>
                                <Skeleton animation="wave" height={10} width="10%" style={{ marginBottom: 6, marginRight: 5 }} />
                                <Skeleton animation="wave" height={10} width="10%" style={{ marginBottom: 6 }} />
                            </>
                            :
                            <>
                                <Tooltip title="Edit this post">
                                    <Button size="small" onClick={() => onEdit(post._id)}>Edit <EditIcon /></Button>
                                </Tooltip>
                                <Tooltip title="Go to this post">
                                    <Button size="small" onClick={() => onReadMore(post)}>Read more<ChevronRightRounded /></Button>
                                </Tooltip>
                            </>
                        }
                    </Box>
                </Box>

                {loading ?
                    <Skeleton animation="wave" variant="rectangular" width={120} height={258} />
                    :
                    <CardMedia
                        component="img"
                        sx={{ width: 170 }}
                        image={post.image}
                        onError={(e: any) => e.target.src = StaticPaths.PLACEHOLDER_IMAGE_PATH}
                        alt={post.header + "image"}
                    />
                }
            </Card>
        </div>

    );
}