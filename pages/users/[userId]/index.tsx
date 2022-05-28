/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';

import { useEffect, useState, useRef } from 'react';

import Typography from '@mui/material/Typography';
import { Grid, Pagination } from '@mui/material';
import Container from '@mui/material/Container';

import { LocalStorageKeys } from '../../../types/enums/local-storage-keys';
import { CategoryArr } from '../../../types/enums/Category';
import { AuthUtils } from '../../../utils/auth-utils';
import { ApiUtils } from '../../../utils/api-utils';
import { Storage } from '../../../utils/storage';
import useBreakpointDetector from '../../../hooks/useBreakpointDetector';
import PostCardMain from '../../../components/Cards/PostCardMain';
import CategoriesMenu from '../../../components/CategoriesMenu';
import ComboBox from '../../../components/ComboBox';


const User: NextPage = ({ ssrPosts }: any) => {

    // next
    const router = useRouter();

    // react
    const isFirstRender = useRef(true);

    const [allData, setAllData] = useState(ssrPosts.data);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [pageCount, setPageCount] = useState(ssrPosts.totalPages);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [totalPostCount, setTotalPostCount] = useState(0);

    // custom
    const isMobile = useBreakpointDetector('md');


    const fetchData = async () => {
        setLoading(true);

        const token = Storage.get(LocalStorageKeys.TOKEN) || "";
        const paths = router.asPath.split("/");
        const userId = paths[paths.length - 1];

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${userId}?sort=createdAt&asc=-1&category=${selectedCategory}&page=${selectedPage}&limit=${pageSize}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        if (jsonData.status) {
            setPageCount(jsonData.data.totalPages)
            setAllData(jsonData.data.data);
            setTotalPostCount(jsonData.data.totalItems);
        }
        else {
            // TODO error alert
            console.log("Error");
        }

        setLoading(false);
    }

    useEffect(() => {
        if (!isFirstRender.current || AuthUtils.isLoggedIn()) {
            fetchData();
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


    const mapCards = () => {
        const posts: any[] = []
        allData.map((post: any, key: any) => {
            posts.push(<PostCardMain post={post} loading={loading} key={key} />)
        })
        return posts
    }


    return (
        <>
            {
                allData.length > 0 ? (
                    <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                        {`${allData[0].owner.username}'s posts (${totalPostCount})`}
                    </Typography>

                ) :
                    <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                        Nothing posted for selected category yet
                    </Typography>
            }

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
        </>
    )
}


export const getServerSideProps = async (context: any) => {
    const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${context.params.userId}?sort=createdAt&asc=-1&page=1&limit=5`)
    const jsonData: any = await res.json();

    return {
        props: {
            ssrPosts: jsonData.data
        },
    }
}


export default User
