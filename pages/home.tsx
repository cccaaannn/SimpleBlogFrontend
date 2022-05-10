import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, BottomNavigation, Button, CardActionArea, CardActions, CardHeader, Grid, Pagination, styled, TableFooter } from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { Storage } from '../utils/storage';
import { LocalStorageKeys } from '../types/enums/local-storage-keys';
import { DateUtils } from '../utils/date-utils';
import { useRouter } from 'next/router';

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import { Category, CategoryArr } from '../types/enums/Category';
import { red, cyan } from '@mui/material/colors';
import { ApiUtils } from '../utils/api-utils';



const Home: NextPage = () => {
    const router = useRouter();
    const theme = useTheme();

    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [allData, setAllData] = useState([] as any[]);
    const [activeData, setActiveData] = useState([] as any[]);
    const pageSize = 5;
    const [selectedCategory, setSelectedCategory] = React.useState(0);


    const fetchPosts = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";

        const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getAll?field=dateCreated&asc=-1&category=${CategoryArr[selectedCategory]}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setAllData(jsonData.data);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    useEffect(() => {
        setSelectedPage(1)
        fetchPosts();
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

    const onReadMore = (postId: string) => {
        router.push(`/posts/${postId}`);
    }

    const mapCards = () => {
        return activeData.map((post, key) => {
            return (
                <Card sx={{ display: 'flex', minWidth: 600, maxWidth: 700, marginBottom: 2 }} key={post._id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 550 }}>
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
                        <CardContent sx={{ flex: '1 0 auto', paddingTop: 0 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {post.header}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {post.body.length < 300 ? post.body : post.body.slice(0, 300) + "..."}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <Button size="small" onClick={() => onReadMore(post._id)}>Read More <ChevronRightRounded /></Button>
                        </Box>
                    </Box>

                    <CardMedia
                        component="img"
                        sx={{ width: 170 }}
                        image={post.image}
                        onError={(e: any) => e.target.src = "http://via.placeholder.com/300"}
                        alt={post.header + "image"}
                    />
                </Card>
            )
        })
    }

    const mapCategories = () => {
        const categoryList = [];

        for (let i = 0; i < CategoryArr.length; i++) {
            categoryList.push(
                <MenuItem selected={selectedCategory == i ? true : false} onClick={(e) => setSelectedCategory(i)} key={i}>
                    <ListItemText>{CategoryArr[i]}</ListItemText>
                    {/* <Typography variant="body2" color="text.secondary">
                    ⌘X
                </Typography> */}
                </MenuItem>
            )
            if (i == 0) {
                categoryList.push(<Divider key={-1} />);
            }
        }

        return categoryList;
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));


    return (

        <Container maxWidth="xl" sx={{ alignItems: 'center', display: 'flex', flexDirection: 'row', marginTop: 3, marginBottom: 2 }}>

            <Grid container spacing={0} >
                <Grid item xs={2}>
                    <Paper sx={{ width: 300, maxWidth: '100%' }}>
                        <MenuList>
                            {mapCategories()}
                        </MenuList>
                    </Paper>
                </Grid>
                <Grid item xs={10}>
                    <Container component="main" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        {/* <CssBaseline /> */}
                        {mapCards()}

                        <Pagination page={selectedPage} count={pageCount} onChange={onPageChange} />
                    </Container>

                </Grid>
            </Grid >
        </Container >


        // <Container sx={{ display: 'flex', flexDirection: 'row', marginTop: 3, marginBottom: 2 }}>
        //     <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 150}}>
        //         <Paper sx={{ width: 300, maxWidth: '100%' }}>
        //             <MenuList>
        //                 {mapCategories()}
        //             </MenuList>
        //         </Paper>
        //     </Box>
        //     <Container component="main" sx={{
        //         display: 'flex',
        //         flexDirection: 'column',
        //         alignItems: 'center'
        //     }}>
        //         {/* <CssBaseline /> */}
        //         {mapCards()}

        //         <Pagination count={pageCount} onChange={onPageChange} />
        //     </Container>

        // </Container>
    )
}

export default Home
