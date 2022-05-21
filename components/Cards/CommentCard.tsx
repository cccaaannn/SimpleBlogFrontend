import { Avatar, Button, Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { DateUtils } from "../../utils/date-utils";
import { Comment } from '../../types/Comment';
import useSSRDetector from "../../hooks/useSSRDetector";
import { AuthUtils } from "../../utils/auth-utils";
import { AvatarUtils } from "../../utils/avatar-utils";


interface CommentCardProps {
    comment: Comment,
    onDelete: any
}

export default function CommentCard({ comment, onDelete }: CommentCardProps) {
    const [isSSR] = useSSRDetector();

    const getUserId = () => {
        let userId: any = null;
        if (!isSSR && AuthUtils.isLoggedIn()) {
            userId = AuthUtils.getTokenPayload().id;
        }
        return userId;
    }

    return (
        <Card sx={{ minWidth: 700, maxWidth: 700, mb: 2 }} key={comment._id}>
            <CardHeader
                avatar={
                    <Avatar {...AvatarUtils.getColorWithLetters(comment.owner.username)}>
                        {comment.owner.username.charAt(0)}
                    </Avatar>
                }

                title={
                    <Button sx={{ padding: 0, textTransform: 'none' }} href={'/users/' + comment.owner._id}>{comment.owner.username}</Button>
                }
                subheader={comment.dateCreated ? DateUtils.toLocalDateString(comment.dateCreated) : ""}
                action={
                    getUserId() == comment.owner._id &&
                    (
                        <IconButton onClick={() => onDelete(comment._id)}>
                            <DeleteIcon />
                        </IconButton>
                    )
                }
            >
            </CardHeader>
            <CardContent>
                <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2" color="text.secondary" component="p">
                    {comment.comment}
                </Typography>
            </CardContent>
        </Card>
    );
}
