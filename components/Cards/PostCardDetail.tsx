import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Tooltip, Typography } from "@mui/material";
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';

import { Post } from "../../types/Post";
import { DateUtils } from "../../utils/date-utils";
import { StaticPaths } from "../../utils/static-paths";
import { AvatarUtils } from "../../utils/avatar-utils";


interface PostCardDetailProps {
    post: Post
}

export default function PostCardDetail({ post }: PostCardDetailProps) {
    return (
        <Card sx={{ minWidth: 700, maxWidth: 700 }}>
            <CardHeader
                avatar={
                    <Avatar {...AvatarUtils.getColorWithLetters(post.owner.username)} />
                }

                title={
                    <Button sx={{ padding: 0, textTransform: 'none' }} href={'/users/' + post.owner._id}>{post.owner.username}</Button>
                }
                subheader={post.dateCreated ? DateUtils.toLocalDateString(post.dateCreated) : ""}
                action={
                    <Typography variant="body2" color="text.secondary" component="div">
                        <Tooltip title="Category">
                            <Chip label={post.category} />
                        </Tooltip>
                        <Tooltip title="Visibility">
                            <Chip label={post.visibility} variant="outlined" sx={{ float: 'right' }} />
                        </Tooltip>
                    </Typography>
                }
            >
            </CardHeader>
            <CardMedia
                component="img"
                sx={{ maxWidth: '%100', maxHeight: 200 }}
                image={post.image}
                onError={(e: any) => e.target.src = StaticPaths.PLACEHOLDER_IMAGE_PATH}
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
    );
}