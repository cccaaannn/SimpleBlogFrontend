import { Button, Link, TextareaAutosize, Typography } from "@mui/material";
import useSSRDetector from "../../hooks/useSSRDetector";
import { AuthUtils } from "../../utils/auth-utils";

interface AddCommentProps {
    comment: any,
    setComment: any,
    onPost: any
}

export default function AddCommentForm({ comment, setComment, onPost }: AddCommentProps) {
    const [isSSR] = useSSRDetector();

    const commentBox = () => {
        if (!isSSR && AuthUtils.isLoggedIn()) {
            return (
                <>
                    <Typography gutterBottom variant="h6" component="div">
                        Add comment
                    </Typography>
                    <TextareaAutosize
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        aria-label="Comment area"
                        placeholder="Comment"
                        style={{ minWidth: 700, maxWidth: 700, minHeight: 100 }}
                    />
                    <Button
                        onClick={onPost}
                        variant="contained"
                        sx={{ mt: 2, mb: 3 }}
                    >
                        send
                    </Button>
                </>
            )
        }
        else {
            return (
                <Link href="/auth/login" variant="body2" sx={{ mt: 2, mb: 3 }}>
                    Login to add comment.
                </Link>
            )
        }
    }

    return (
        <>
            {commentBox()}
        </>
    );
}