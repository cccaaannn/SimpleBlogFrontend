import type { NextPage } from 'next'
import * as React from 'react';
import { useEffect, useState } from 'react';

import { Grid, Pagination } from '@mui/material';
import Container from '@mui/material/Container';

import { Storage } from '../utils/storage';
import { LocalStorageKeys } from '../types/enums/local-storage-keys';
import { CategoryArr } from '../types/enums/Category';
import { ApiUtils } from '../utils/api-utils';
import CategoriesMenu from '../components/CategoriesMenu';
import PostCardHome from '../components/Cards/PostCardHome';
import useSSRDetector from '../hooks/useSSRDetector';
import { AuthUtils } from '../utils/auth-utils';
import usePagination from '../hooks/usePagination';
import Head from 'next/head';
import OpenGraph from '../components/OpenGraph';
import { StaticPaths } from '../utils/static-paths';


const Home: NextPage = ({ postProp, referer }: any) => {

    const [allData, setAllData] = useState(postProp);
    const [selectedCategory, setSelectedCategory] = useState(0);

    const [activeData, pageCount, selectedPage, setSelectedPage, pageSize, setPageSize] = usePagination(allData);

    const [isSSR] = useSSRDetector();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSSR && AuthUtils.isLoggedIn()) {
            fetchPosts();
        }
    }, [])

    useEffect(() => {
        setSelectedPage(1)
        fetchPosts();
    }, [selectedCategory])



    const fetchPosts = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";
        console.log("CSR");

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
            setLoading(false);
        }
    }

    const mapCards = () => {
        const posts: any[] = []
        activeData.map((post: any, key: any) => {
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
    
            <Container maxWidth="xl" sx={{ alignItems: 'center', display: 'flex', flexDirection: 'row', marginTop: 3, marginBottom: 2 }}>

                <Grid container spacing={0} >
                    <Grid item xs={2}>
                        <CategoriesMenu
                            selected={selectedCategory}
                            setSelected={setSelectedCategory}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Container component="main" sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            {mapCards()}

                            <Pagination page={selectedPage} count={pageCount} onChange={(e, value) => setSelectedPage(value)} />
                        </Container>

                    </Grid>
                </Grid >
            </Container >
        </>

    )
}

export const getServerSideProps = async (context: any) => {
    const response = await fetch(`${ApiUtils.getApiUrl()}/posts/getAll?field=dateCreated&asc=-1&category=All`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const jsonData = await response.json();

    return {
        props: {
            postProp: jsonData.data,
            referer: context.req.headers.referer ? context.req.headers.referer : ""
        },
    }
}


export default Home
