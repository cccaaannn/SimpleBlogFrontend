import type { NextPage } from 'next'
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';

import { Grid, Pagination } from '@mui/material';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

import { Storage } from '../utils/storage';
import { LocalStorageKeys } from '../types/enums/local-storage-keys';
import { CategoryArr } from '../types/enums/Category';
import { ApiUtils } from '../utils/api-utils';
import CategoriesMenu from '../components/CategoriesMenu';
import PostCardHome from '../components/PostCardHome';
import useSSRDetector from '../hooks/useSSRDetector';
import { AuthUtils } from '../utils/auth-utils';


const Home: NextPage = (props: any) => {
    const router = useRouter();
    const theme = useTheme();
    const isMounted = useRef(false);

    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [allData, setAllData] = useState(props.allData as any);
    const [activeData, setActiveData] = useState([] as any[]);
    const pageSize = 5;
    const [selectedCategory, setSelectedCategory] = React.useState(0);

    const [isSSR] = useSSRDetector();

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
        }
    }

    useEffect(() => {
        if (!isSSR && AuthUtils.isLoggedIn()) {
            fetchPosts();
        }
    }, [])

    useEffect(() => {
        setSelectedPage(1)
        fetchPosts();
    }, [selectedCategory])

    useEffect(() => {
        if (allData != null) {
            const pages = Math.ceil(allData.length / pageSize);
            setPageCount(pages)
        }
    }, [allData])

    useEffect(() => {
        if (allData != null) {
            const data = allData.slice((selectedPage - 1) * pageSize, selectedPage * pageSize);
            setActiveData(data)
        }
    }, [allData, selectedPage])

    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelectedPage(value);
    };

    const mapCards = () => {
        const posts: any[] = []
        activeData.map((post, key) => {
            posts.push(<PostCardHome post={post} />)
        })
        return posts
    }

    return (
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
                        {/* <CssBaseline /> */}
                        {mapCards()}

                        <Pagination page={selectedPage} count={pageCount} onChange={onPageChange} />
                    </Container>

                </Grid>
            </Grid >
        </Container >
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
            allData: jsonData.data
        },
    }
}


export default Home
