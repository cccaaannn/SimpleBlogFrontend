import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Skeleton, Tooltip, Typography } from "@mui/material";
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';

import { Post } from "../../types/Post";
import { DateUtils } from "../../utils/date-utils";
import { StaticPaths } from "../../utils/static-paths";
import { AvatarUtils } from "../../utils/avatar-utils";
import SkeletonTextBody from "../SkeletonTextBody";
import useBreakpointDetector from "../../hooks/useBreakpointDetector";


interface PostCardDetailProps {
    post: Post,
    loading: boolean
}

export default function PostCardDetail({ post, loading }: PostCardDetailProps) {

    const isMobile = useBreakpointDetector('md');

    return (
        <Card>
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
                    loading ?
                        <Skeleton animation="wave" variant="rectangular" width={100} height={25} />
                        :
                        <>
                            <Typography variant="body2" color="text.secondary" component="div">

                                <Tooltip title="Category">
                                    <Chip label={post.category} />
                                </Tooltip>
                                <Tooltip title="Visibility">
                                    <Chip label={post.visibility} variant="outlined" sx={{ float: 'right' }} />
                                </Tooltip>
                                {/* {
                                    (post.createdAt != post.updatedAt) &&
                                    <Tooltip title={"Updated: " + DateUtils.toLocalDateString(post.updatedAt)}>
                                        <Chip label={"Edited"} variant="outlined" sx={{ mt: 1 }} />
                                    </Tooltip>
                                } */}

                            </Typography>
                        </>
                }
            >
            </CardHeader>
            {loading ?
                <Skeleton animation="wave" variant="rectangular" width="100%" height={158} />
                :
                <CardMedia
                    component="img"
                    sx={{ maxHeight: 200 }}
                    image={post.image}
                    onError={(e: any) => e.target.src = StaticPaths.PLACEHOLDER_IMAGE_PATH}
                    alt={post.header + "image"}
                />
            }
            <CardContent>
                {loading ? (
                    <SkeletonTextBody lineCount={21} />
                ) : (
                    <>
                        <Typography gutterBottom variant="h5" component="div">
                            {post.header}
                        </Typography>

                        <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2" color="text.secondary" component="p">
                            {post.body}
                        </Typography>
                    </>
                )}
            </CardContent>
            <CardActions>
                {loading ?
                    <Skeleton animation="wave" height={10} width="10%" style={{ marginBottom: 6 }} />
                    :
                    <Button size="small" href='/home'><ChevronLeftRounded /> Go Back</Button>
                }
            </CardActions>
        </Card>
    );
}