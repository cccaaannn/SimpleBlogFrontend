import { Avatar, Button, Card, CardContent, CardHeader, IconButton, Skeleton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { DateUtils } from "../../utils/date-utils";
import { Comment } from '../../types/Comment';
import useSSRDetector from "../../hooks/useSSRDetector";
import { AuthUtils } from "../../utils/auth-utils";
import { AvatarUtils } from "../../utils/avatar-utils";
import SkeletonTextBody from "../SkeletonTextBody";


interface CommentCardProps {
    comment: Comment,
    onDelete: any,
    loading: boolean
}

export default function CommentCard({ comment, onDelete, loading }: CommentCardProps) {
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
                    loading ?
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        :
                        <Avatar {...AvatarUtils.getColorWithLetters(comment.owner.username)} />
                }

                title={
                    loading ?
                        <Skeleton animation="wave" height={10} width="60%" style={{ marginBottom: 6 }} />
                        :
                        <Button sx={{ padding: 0, textTransform: 'none' }} href={'/users/' + comment.owner._id}>{comment.owner.username}</Button>
                }
                subheader={
                    loading ?
                        <Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }} />
                        :
                        comment.createdAt ? DateUtils.toLocalDateString(comment.createdAt) : ""
                }
                action={
                    !loading && getUserId() == comment.owner._id &&
                    (
                        <IconButton onClick={() => onDelete(comment._id)}>
                            <DeleteIcon />
                        </IconButton>
                    )
                }
            >
            </CardHeader>
            <CardContent>
                {loading ? (
                    <SkeletonTextBody lineCount={4} />
                ) : (
                    <>
                        <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2" color="text.secondary" component="p">
                            {comment.comment}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
