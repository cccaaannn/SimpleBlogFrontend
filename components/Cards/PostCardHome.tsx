import { useRouter } from 'next/router';

import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Chip, Skeleton, Tooltip, Typography } from "@mui/material";
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'

import { Post } from "../../types/Post";
import { DateUtils } from "../../utils/date-utils";
import { StaticPaths } from '../../utils/static-paths';
import { AvatarUtils } from '../../utils/avatar-utils';
import SkeletonTextBody from '../SkeletonTextBody';


interface PostCardHomeProps {
    post: Post,
    loading: boolean
}

export default function PostCardHome({ post, loading }: PostCardHomeProps) {
    const router = useRouter();

    const onReadMore = (post: Post) => {
        router.push(`/users/${post.owner._id}/posts/${post._id}`);
    }

    return (
        <Card sx={{ display: 'flex', minWidth: 600, maxWidth: 700, marginBottom: 2 }} key={post._id}>
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
                        <Skeleton animation="wave" height={10} width="10%" style={{ marginBottom: 6 }} />
                        :
                        <Button size="small" onClick={() => onReadMore(post)}>Read More <ChevronRightRounded /></Button>}
                </Box>
            </Box>
            {loading ?
                <Skeleton animation="wave" variant="rectangular" width={120} height={158} />
                :
                <CardMedia
                    component="img"
                    sx={{ width: 170 }}
                    image={post.image}
                    onError={(e: any) => e.target.src = StaticPaths.PLACEHOLDER_IMAGE_PATH}
                    alt={post.header + "image"}
                />}
        </Card>
    );
}