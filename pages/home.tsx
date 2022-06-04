/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import type { NextPage } from 'next'
import Head from 'next/head';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';

import { Fab, Grid, Pagination } from '@mui/material';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';

import Carousel from 'react-material-ui-carousel';

import { CategoryArr } from '../types/enums/Category';
import { ApiService } from '../services/api-service';
import { StaticPaths } from '../utils/static-paths';
import { AuthUtils } from '../utils/auth-utils';
import { ApiUtils } from '../utils/api-utils';
import PostCardMostLiked from '../components/Cards/PostCardMostLiked';
import useBreakpointDetector from '../hooks/useBreakpointDetector';
import PostCardMain from '../components/Cards/PostCardMain';
import CategoriesMenu from '../components/CategoriesMenu';
import useAlertMessage from '../hooks/useAlertMessage';
import AlertMessage from '../components/AlertMessage';
import useSSRDetector from '../hooks/useSSRDetector';
import OpenGraph from '../components/OpenGraph';
import ComboBox from '../components/ComboBox';


const Home: NextPage = ({ ssrPosts, ssrMostLikedPosts, referer }: any) => {

    // next
    const router = useRouter();

    // react
    const isFirstRender = useRef(true);

    const [allData, setAllData] = useState(ssrPosts.data);
    const [mostLikedData, setMostLikedData] = useState(ssrMostLikedPosts.data);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [pageCount, setPageCount] = useState(ssrPosts.totalPages);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // custom
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();
    const isMobile = useBreakpointDetector('md');
    const isSm = useBreakpointDetector('sm');
    const isSSR = useSSRDetector();


    useEffect(() => {
        if (!isFirstRender.current || AuthUtils.isLoggedIn()) {
            fetchData();
            fetchMostLiked();
        }

        isFirstRender.current = false;
    }, [selectedPage, pageSize, selectedCategory])


    useEffect(() => {
        setSelectedPage(1);
    }, [selectedCategory])


    useEffect(() => {
        if (allData.length == 0 || allData[0]._id) {
            setLoading(false);
        }
    }, [allData])


    const fetchData = async () => {
        setLoading(true);

        console.log("CSR");
        const response = await ApiService.get(`/posts/getAll?sort=createdAt&asc=-1&category=${selectedCategory}&page=${selectedPage}&limit=${pageSize}`);

        const jsonData = await response.json();

        console.log(jsonData);

        if (jsonData.status) {
            setPageCount(jsonData.data.totalPages)
            setAllData(jsonData.data.data);
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }

        setLoading(false);
    }

    const fetchMostLiked = async () => {
        setLoading(true);

        const response = await ApiService.get(`/posts/getAll?sort=likes&asc=-1&category=${selectedCategory}&page=1&limit=8`);

        const jsonData = await response.json();

        console.log(jsonData);

        if (jsonData.status) {
            setMostLikedData(jsonData.data.data);
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }

        setLoading(false);
    }

    const mapCards = () => {
        const posts: any[] = []
        allData.map((post: any, key: any) => {
            posts.push(<PostCardMain post={post} loading={loading} key={key} />)
        })
        return posts
    }


    const getMostLikedRow = (i: number) => {
        return (
            <Grid item xs={12} sm={6} md={3} >
                {mostLikedData[i] && <PostCardMostLiked post={mostLikedData[i]} loading={loading} key={i} />}
            </Grid>
        )
    }

    const mapMostLiked = () => {
        const posts: any[] = []

        const itemCount = isMobile ? 1 : isSm ? 2 : 4;

        for (let i = 0; i < mostLikedData.length; i = i + itemCount) {
            posts.push(
                <Grid container spacing={1} >
                    {
                        getMostLikedRow(i)
                    }
                    {
                        !isSm &&
                        getMostLikedRow(i + 1)
                    }
                    {
                        !isMobile &&
                        getMostLikedRow(i + 2)
                    }
                    {
                        !isMobile &&
                        getMostLikedRow(i + 3)
                    }
                </Grid>
            )
        }
        return posts
    }

    return (
        <>
            <Head>
                <OpenGraph
                    url={referer}
                    title={"Simple Blog"}
                    description={"Join and share your posts."}
                    image={StaticPaths.ICON_100}
                />
            </Head>

            <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
            <Grid container spacing={1} >
                <Grid item xs={12}>
                    <Carousel
                        animation='fade'
                        cycleNavigation={true}
                        navButtonsAlwaysVisible={false}
                        swipe={true}
                        changeOnFirstRender={true}
                        stopAutoPlayOnHover={true}
                        // height={300}

                        sx={{ mb: 2 }}
                    >
                        {mapMostLiked()}
                    </Carousel>
                </Grid>

                {isMobile &&
                    <Grid item xs={12}>
                        <ComboBox
                            name='Categories'
                            inputsList={CategoryArr}
                            selected={selectedCategory}
                            setSelected={setSelectedCategory}
                        />
                    </Grid>
                }
                {!isMobile &&
                    <Grid item md={2}>
                        <CategoriesMenu
                            selected={selectedCategory}
                            setSelected={setSelectedCategory}
                            loading={loading}
                        />
                    </Grid>
                }
                <Grid item xs={12} md={10}>
                    {mapCards()}
                    <Container component="div" sx={{
                        marginBottom: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Pagination page={selectedPage} count={pageCount} onChange={(e, value) => setSelectedPage(value)} />
                    </Container>
                </Grid>
            </Grid >

            {/* Fab */}
            {!isSSR && AuthUtils.isLoggedIn() &&
                <Fab color="secondary" aria-label="edit" onClick={() => router.push("/me/add-post")} sx={{
                    margin: 0,
                    top: 'auto',
                    right: 20,
                    bottom: 20,
                    left: 'auto',
                    position: 'fixed'
                }}>
                    <EditIcon />
                </Fab>
            }
        </>
    )
}


export const getServerSideProps = async (context: any) => {
    const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getAll?sort=createdAt&asc=-1&category=All&page=1&limit=5`);
    const jsonData = await response.json();

    const response2 = await fetch(`${ApiUtils.getApiUrl()}/posts/getAll?sort=likes&asc=-1&category=All&page=1&limit=8`);
    const jsonData2 = await response2.json();

    return {
        props: {
            ssrPosts: jsonData.data,
            ssrMostLikedPosts: jsonData2.data,
            referer: context.req.headers.referer ? context.req.headers.referer : ""
        },
    }
}


export default Home
