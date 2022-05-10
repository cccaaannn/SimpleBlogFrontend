import Link from 'next/link'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, BottomNavigation, Button, CardActionArea, CardActions, CardHeader, Pagination, TableFooter } from '@mui/material';
import { ChevronRightRounded, ChevronLeftRounded, Subtitles } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Storage } from '../../../utils/storage';
import { LocalStorageKeys } from '../../../types/enums/local-storage-keys';
import { DateUtils } from '../../../utils/date-utils';
import { useRouter } from 'next/router';
import { red, cyan } from '@mui/material/colors';
import { AuthUtils } from '../../../utils/auth-utils'
import { ApiUtils } from '../../../utils/api-utils'


const User = ({ postsProp }: any) => {
    const router = useRouter();
    const paths = router.asPath.split("/");;
    const postId = paths[paths.length - 1];


    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [allData, setAllData] = useState([] as any[]);
    const [activeData, setActiveData] = useState(postsProp as any);
    const pageSize = 5;
    const [selectedCategory, setSelectedCategory] = React.useState(0);



    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${postId}?field=dateCreated&asc=-1`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        setActiveData(jsonData.data);
    }
    

    useEffect(() => {
        fetchData();
    }, [selectedCategory])

    useEffect(() => {
        const pages = Math.ceil(allData.length / pageSize);
        setPageCount(pages)
    }, [allData])

    useEffect(() => {
        const data = allData.slice((selectedPage - 1) * pageSize, selectedPage * pageSize);
        setActiveData(data)
    }, [allData, selectedPage])

    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelectedPage(value);
    };

    const onBack = (userId: string) => {
        // router.push(`/users/${userId}`);
        router.push(`/home`);
    }

    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            fetchData();
        }
    }, [])

    const getPostWhenDefined = () => {
        return activeData.map((post: any, key: any) => {
            return (
                <Card sx={{ minWidth: 700, maxWidth: 700 }} key={post._id}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: cyan[500] }} aria-label="username">
                                {post.owner.username.charAt(0)}
                            </Avatar>
                        }

                        title={
                            <Button sx={{ padding: 0, textTransform:'none' }} href={'/users/' + post.owner._id}>{post.owner.username}</Button>
                        }
                        subheader={post.dateCreated ? DateUtils.toLocalDateString(post.dateCreated) : ""}
                    // action={

                    // }
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
                        <Button size="small" onClick={() => onBack(post.owner._id)}><ChevronLeftRounded /> Go Back</Button>
                    </CardActions>
                </Card>
            )
        })
    }

    return (
        <Container component="main" sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {getPostWhenDefined()}
            <Pagination page={selectedPage} count={pageCount} onChange={onPageChange} />
        </Container>

    )
}

export const getServerSideProps = async (context: any) => {
    const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${context.params.id}?field=dateCreated&asc=-1`)
    const jsonData: any = await res.json();

    return {
        props: {
            postsProp: jsonData.data
        },
    }
}

export default User
