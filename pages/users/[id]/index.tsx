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
import PostCardHome from '../../../components/PostCardHome';
import { Post } from '../../../types/Post';
import CategoriesMenu from '../../../components/CategoriesMenu';
import useSSRDetector from '../../../hooks/useSSRDetector';
import { CategoryArr } from '../../../types/enums/Category';


const User = ({ postsProp }: { postsProp: Post[] }) => {
    const router = useRouter();
    const paths = router.asPath.split("/");;
    const userId = paths[paths.length - 1];


    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [allData, setAllData] = useState(postsProp as Post[]);
    const [activeData, setActiveData] = useState([] as Post[]);
    const pageSize = 5;
    const [selectedCategory, setSelectedCategory] = React.useState(0);


    const [isSSR] = useSSRDetector();


    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${userId}?field=dateCreated&asc=-1&category=${CategoryArr[selectedCategory]}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        setAllData(jsonData.data as Post[]);
    }


    useEffect(() => {
        if (!isSSR && AuthUtils.isLoggedIn()) {
            fetchData();
        }
    }, [])

    useEffect(() => {
        setSelectedPage(1)
        fetchData();
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
        <Container component="main" sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
        }}>
            {
                postsProp.length > 0 ? (
                    <>
                        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                            {postsProp[0].owner.username + "'s posts"}
                        </Typography>

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
                                    <Pagination page={selectedPage} count={pageCount} onChange={onPageChange} />
                                </Container>

                            </Grid>
                        </Grid >
                    </>
                ) :
                    <>
                        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                            There are no posts here
                        </Typography>
                    </>
            }

        </Container>

    )
}

export const getServerSideProps = async (context: any) => {
    const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${context.params.id}?field=dateCreated&asc=-1`)
    const jsonData: any = await res.json();

    return {
        props: {
            postsProp: jsonData.data as Post[]
        },
    }
}

export default User
