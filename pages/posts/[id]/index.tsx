import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Avatar, Button, CardActions, CardHeader } from '@mui/material';
// import { ChevronLeftRounded } from '@mui/icons-material';
// import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
// import { cyan } from '@mui/material/colors';


import { Storage } from '../../../utils/storage';
import { LocalStorageKeys } from '../../../types/enums/local-storage-keys';
import { DateUtils } from '../../../utils/date-utils';
import { ApiUtils } from '../../../utils/api-utils'
import Image from 'next/image';
import Link from 'next/link';


const Post = ({ postProp }: any) => {
    const router = useRouter();
    const paths = router.asPath.split("/");;
    const postId = paths[paths.length - 1];

    const [post, setPost] = useState(postProp);

    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${postId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        setPost(jsonData.data);
    }

    useEffect(() => {
        if (post == null) {
            fetchData();
        }
    }, [])

    const getPostWhenDefined = () => {
        if (post != null) {
            return (
                <div>
                    <div>
                        <Link href={'/users/' + post.owner._id}>{post.owner.username}</Link>
                        {post.dateCreated ? DateUtils.toLocalDateString(post.dateCreated) : ""}
                    </div>

                    <Image
                    loader={() => post.image}
                        src={post.image}
                        onError={(e: any) => e.target.src = "http://via.placeholder.com/300"}
                        alt={post.header + "image"}
                        width={500} height={500}
                    />
                    <div>
                        <h5>
                            {post.header}
                        </h5>

                        <p>
                            {post.body}
                        </p>
                    </div>
                    <div>
                        <Link href='/home'>Go Back</Link>
                    </div>
                </div>
            )
        }
    }

    const getCommentsWhenDefined = () => {
        if (post != null) {
            return post.comments.map((comment: any, key: any) => {
                return (
                    <div key={comment._id}>
                        <div
                        // avatar={
                        //     <Avatar sx={{ bgcolor: cyan[500] }} aria-label="username">
                        //         {post.owner.username.charAt(0)}
                        //     </Avatar>
                        // }

                        // title={

                        // }
                        // subheader={comment.dateCreated ? DateUtils.toLocalDateString(comment.dateCreated) : ""}
                        >
                            <Link href={'/users/' + comment.owner._id}>{comment.owner.username}</Link>
                            {comment.dateCreated ? DateUtils.toLocalDateString(comment.dateCreated) : ""}
                        </div>
                        <div>
                            <p>
                                {comment.comment}
                            </p>
                        </div>
                    </div>
                )
            })
        }
    }


    return (
        <>
            {getPostWhenDefined()}
            < br />
            <h5>
                Comments
            </h5>
            <br />
            {getCommentsWhenDefined()}
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getById/${context.params.id}`)
    const jsonData: any = await res.json();

    return {
        props: {
            postProp: jsonData.data
        },
    }
}

export default Post
