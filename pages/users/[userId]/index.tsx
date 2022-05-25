import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Grid, Pagination } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LocalStorageKeys } from '../../../types/enums/local-storage-keys';
import { ApiUtils } from '../../../utils/api-utils';
import { AuthUtils } from '../../../utils/auth-utils';
import { Storage } from '../../../utils/storage';
import PostCardHome from '../../../components/Cards/PostCardHome';
import { Post } from '../../../types/Post';
import CategoriesMenu from '../../../components/CategoriesMenu';
import { CategoryArr } from '../../../types/enums/Category';
import usePagination from '../../../hooks/usePagination';
import useBreakpointDetector from '../../../hooks/useBreakpointDetector';
import ComboBox from '../../../components/ComboBox';


const User = ({ postsProp }: { postsProp: Post[] }) => {
    const router = useRouter();

    const [allData, setAllData] = useState(postsProp);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const isMobile = useBreakpointDetector('md');

    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [totalPostCount, setTotalPostCount] = useState(0);


    const fetchData = async () => {
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

        setPageCount(jsonData.data.totalPages)
        setAllData(jsonData.data.data as Post[]);
        setTotalPostCount(jsonData.data.totalItems)
        setLoading(false);
    }


    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            fetchData();
        }
    }, [])

    useEffect(() => {
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPage, pageSize, selectedCategory])

    useEffect(() => {
        setSelectedPage(1)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory])


    const mapCards = () => {
        const posts: any[] = []
        allData.map((post: any, key: any) => {
            posts.push(<PostCardHome post={post} loading={loading} />)
        })
        return posts
    }


    return (
        <Container component="main" maxWidth="lg" sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
        }}>
            {
                allData.length > 0 ? (
                    <>
                        <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                            {`${allData[0].owner.username}'s posts (${totalPostCount})`}
                        </Typography>

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
                ) :
                    <>
                        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                            Nothing posted yet
                        </Typography>
                    </>
            }

        </Container>

    )
}

export const getServerSideProps = async (context: any) => {
    const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${context.params.userId}?sort=createdAt&asc=-1&page=1&limit=5`)
    const jsonData: any = await res.json();

    return {
        props: {
            postsProp: jsonData.data.data as Post[]
        },
    }
}

export default User
