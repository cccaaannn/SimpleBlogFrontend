import { Button, Container, Grid, Link, TextareaAutosize, TextField, Typography } from "@mui/material";
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
                <Grid container spacing={0} >
                    <Grid item xs={12} md={12}>
                        <Typography gutterBottom variant="h6" component="div">
                            Add comment
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Comment"
                            multiline
                            required
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            aria-label="Comment area"
                            placeholder="Comment"
                            // error={comment.trim() == "" ? true : false}
                            sx={{ display: 'flex' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button
                            onClick={onPost}
                            variant="contained"
                            sx={{ mt: 2, mb: 3, float: 'right' }}
                        >
                            send
                        </Button>
                    </Grid>
                </Grid>
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