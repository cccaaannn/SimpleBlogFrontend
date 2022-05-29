import { useRouter } from 'next/router';

import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Chip, Grid, Skeleton, Tooltip, Typography } from "@mui/material";
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'

import { AvatarUtils } from '../../utils/avatar-utils';
import { StaticPaths } from '../../utils/static-paths';
import { DateUtils } from "../../utils/date-utils";
import { Post } from "../../types/Post";
import useBreakpointDetector from '../../hooks/useBreakpointDetector';
import SkeletonTextBody from '../SkeletonTextBody';


interface PostCardMainProps {
    post: Post,
    loading: boolean
}

export default function PostCardMain({ post, loading }: PostCardMainProps) {

    const router = useRouter();
    const isMobile = useBreakpointDetector('md');

    const onReadMore = (post: Post) => {
        router.push(`/users/${post.owner._id}/posts/${post._id}`);
    }

    return (
        <Card sx={{ display: 'flex', marginBottom: 2 }} key={post._id}>

            <Grid container spacing={0} >
                <Grid item xs={12} md={10} >
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
                                post.createdAt ? DateUtils.toLocalDateString(post.createdAt) : ""
                        }
                        action={
                            !loading && (post.createdAt != post.updatedAt) && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                    <Tooltip title={"Updated: " + DateUtils.toLocalDateString(post.updatedAt)}>
                                        <Chip label={"Edited"} variant="outlined" sx={{ float: 'right' }} />
                                    </Tooltip>
                                </Typography>
                            )
                        }
                    >
                    </CardHeader>
                    {
                        isMobile && (
                            loading ?
                                <Skeleton animation="wave" variant="rectangular" width="100%" height={158} />
                                :
                                <CardMedia
                                    component="img"
                                    sx={{ maxWidth: '%100', maxHeight: 200 }}
                                    image={post.image}
                                    onError={(e: any) => e.target.src = StaticPaths.PLACEHOLDER_IMAGE_PATH}
                                    alt={post.header + "image"}
                                />)
                    }
                    <CardContent sx={{ flex: '1 0 auto', paddingTop: 1 }}>

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
                </Grid>

                {!isMobile &&
                    <Grid item xs={2}>
                        {loading ?
                            <Skeleton animation="wave" variant="rectangular" height="100%" />
                            :
                            <CardMedia
                                component="img"
                                height="100%"
                                image={post.image}
                                onError={(e: any) => e.target.src = StaticPaths.PLACEHOLDER_IMAGE_PATH}
                                alt={post.header + "image"}
                            />
                        }
                    </Grid>}
            </Grid>
        </Card >
    );
}