import { useRouter } from 'next/router';

import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import { cyan } from '@mui/material/colors';

import { Post } from "../../types/Post";
import { DateUtils } from "../../utils/date-utils";


interface PostCardDetailProps {
    post: Post
}

export default function PostCardDetail({ post }: PostCardDetailProps) {
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
    );
}