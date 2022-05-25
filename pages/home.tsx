import type { NextPage } from 'next'
import Head from 'next/head';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { Fab, Grid, Pagination } from '@mui/material';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';

import { Storage } from '../utils/storage';
import { LocalStorageKeys } from '../types/enums/local-storage-keys';
import { CategoryArr } from '../types/enums/Category';
import { ApiUtils } from '../utils/api-utils';
import CategoriesMenu from '../components/CategoriesMenu';
import PostCardHome from '../components/Cards/PostCardHome';
import useSSRDetector from '../hooks/useSSRDetector';
import { AuthUtils } from '../utils/auth-utils';
import usePagination from '../hooks/usePagination';
import OpenGraph from '../components/OpenGraph';
import { StaticPaths } from '../utils/static-paths';
import useBreakpointDetector from '../hooks/useBreakpointDetector';
import ComboBox from '../components/ComboBox';
import { useRouter } from 'next/router';


const Home: NextPage = ({ postProp, referer }: any) => {
    
    const router = useRouter();
    const [allData, setAllData] = useState(postProp);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const isMobile = useBreakpointDetector('md');

    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);


    const [isSSR] = useSSRDetector();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            fetchPosts();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetchPosts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPage, pageSize, selectedCategory])

    useEffect(() => {
        setSelectedPage(1)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory])


    const fetchPosts = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";
        console.log("CSR");

        const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getAll?sort=createdAt&asc=-1&category=${selectedCategory}&page=${selectedPage}&limit=${pageSize}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setPageCount(jsonData.data.totalPages)
            setAllData(jsonData.data.data);
            setLoading(false);
        }
    }

    const mapCards = () => {
        const posts: any[] = []
        allData.map((post: any, key: any) => {
            posts.push(<PostCardHome post={post} loading={loading} />)
        })
        return posts
    }

    return (
        <>
            <Head>
                <OpenGraph
                    url={referer}
                    title={"Simple Blog"}
                    description={"A simple blog website."}
                    image={StaticPaths.ICON_100}
                />
            </Head>

            <Container maxWidth="lg" sx={{ alignItems: 'center', display: 'flex', flexDirection: 'row', marginTop: 3, marginBottom: 2 }}>

                <Grid container spacing={1} >
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

            </Container >
            
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
    const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getAll?sort=createdAt&asc=-1&category=All&page=1&limit=5`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const jsonData = await response.json();

    return {
        props: {
            postProp: jsonData.data.data,
            referer: context.req.headers.referer ? context.req.headers.referer : ""
        },
    }
}


export default Home
