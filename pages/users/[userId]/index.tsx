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


const User = ({ postsProp }: { postsProp: Post[] }) => {
    const router = useRouter();

    const [allData, setAllData] = useState(postsProp);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [loading, setLoading] = useState(true);

    const [activeData, pageCount, selectedPage, setSelectedPage, pageSize, setPageSize] = usePagination(allData);


    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";
        const paths = router.asPath.split("/");
        const userId = paths[paths.length - 1];

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${userId}?field=createdAt&asc=-1&category=${CategoryArr[selectedCategory]}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        setAllData(jsonData.data as Post[]);
        setLoading(false);
    }


    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            fetchData();
        }
    }, [])

    useEffect(() => {
        setSelectedPage(1)
        fetchData();
    }, [selectedCategory])


    const mapCards = () => {
        const posts: any[] = []
        activeData.map((post: any, key: any) => {
            posts.push(<PostCardHome post={post} loading={loading} />)
        })
        return posts
    }


    return (
        <Container component="main" sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
        }}>
            {
                allData.length > 0 ? (
                    <>
                        <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                            {`${allData[0].owner.username}'s posts (${allData.length})`}
                        </Typography>

                        <Grid container spacing={0} >
                            <Grid item xs={2}>
                                <CategoriesMenu
                                    selected={selectedCategory}
                                    setSelected={setSelectedCategory}
                                    loading={loading}
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
    const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${context.params.userId}?field=createdAt&asc=-1`)
    const jsonData: any = await res.json();

    return {
        props: {
            postsProp: jsonData.data as Post[]
        },
    }
}

export default User
