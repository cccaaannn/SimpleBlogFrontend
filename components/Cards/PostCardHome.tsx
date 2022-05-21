import { useRouter } from 'next/router';

import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Chip, Tooltip, Typography } from "@mui/material";
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'

import { Post } from "../../types/Post";
import { DateUtils } from "../../utils/date-utils";
import { Visibility } from '../../types/enums/Visibility';
import { StaticPaths } from '../../utils/static-paths';
import { AvatarUtils } from '../../utils/avatar-utils';


interface PostCardHomeProps {
    post: Post
}

export default function PostCardHome({ post }: PostCardHomeProps) {
    const router = useRouter();

    const onReadMore = (post: Post) => {
        router.push(`/users/${post.owner._id}/posts/${post._id}`);
    }

    return (
        <Card sx={{ display: 'flex', minWidth: 600, maxWidth: 700, marginBottom: 2 }} key={post._id}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 550 }}>
                <CardHeader
                    avatar={
                        <Avatar {...AvatarUtils.getColorWithLetters(post.owner.username)}>
                            {post.owner.username.charAt(0)}
                        </Avatar>
                    }

                    title={
                        <Button sx={{ padding: 0, textTransform: 'none' }} href={'/users/' + post.owner._id}>{post.owner.username}</Button>
                    }
                    subheader={post.dateCreated ? DateUtils.toLocalDateString(post.dateCreated) : ""}
                >
                </CardHeader>
                <CardContent sx={{ flex: '1 0 auto', paddingTop: 0 }}>
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
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <Button size="small" onClick={() => onReadMore(post)}>Read More <ChevronRightRounded /></Button>
                </Box>
            </Box>

            <CardMedia
                component="img"
                sx={{ width: 170 }}
                image={post.image}
                onError={(e: any) => e.target.src = StaticPaths.PLACEHOLDER_IMAGE_PATH}
                alt={post.header + "image"}
            />
        </Card>
    );
}