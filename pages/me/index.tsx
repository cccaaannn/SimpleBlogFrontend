import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Button, Grid, Pagination, Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { AuthUtils } from '../../utils/auth-utils';
import { Storage } from '../../utils/storage';
import useAlertMessage from '../../hooks/useAlertMessage';
import { CategoryArr } from '../../types/enums/Category';
import UpdateAccount from '../../components/UpdateAccount';
import CategoriesMenu from '../../components/CategoriesMenu';
import PostCardMe from '../../components/PostCardMe';
import AlertMessage from '../../components/AlertMessage';
import usePagination from '../../hooks/usePagination';


const User = () => {
    const router = useRouter();


    const [allData, setAllData] = useState([] as any[]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [activeData, pageCount, selectedPage, setSelectedPage, pageSize, setPageSize] = usePagination(allData);

    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            fetchData();
        }
    }, [])

    useEffect(() => {
        setSelectedPage(1)
        fetchData();
    }, [selectedCategory])



    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${AuthUtils.getTokenPayload().id}?field=dateCreated&asc=-1&category=${CategoryArr[selectedCategory]}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        setAllData(jsonData.data);
    }

    const onDelete = async (postId: string) => {
        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/delete/${postId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Storage.get(LocalStorageKeys.TOKEN)}`
            },
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        if (jsonData.status) {
            setMessageWithType("Post deleted", "success");
            fetchData();
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }
    }

    const mapCards = () => {
        const posts: any[] = []
        activeData.map((post: any, key: any) => {
            posts.push(<PostCardMe post={post} onDelete={onDelete} />)
        })
        return posts
    }

    const getContentForSelectedTab = () => {
        if (selectedTab == 0) {
            return (
                <>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            href='/me/add-post'
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Add new
                        </Button>
                    </Box>

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
                                <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
                                {mapCards()}
                                <Pagination page={selectedPage} count={pageCount} onChange={(e, value) => setSelectedPage(value)} />
                            </Container>
                        </Grid>
                    </Grid >
                </>
            )
        }
        if (selectedTab == 1) {
            return <UpdateAccount />
        }
    }


    return (
        <Container component="main" sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
        }}>

            <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                Account
            </Typography>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={(e, value) => setSelectedTab(value)} aria-label="basic tabs example">
                        <Tab label="My post" value={0} />
                        <Tab label="Settings" value={1} />
                    </Tabs>
                </Box>
            </Box>

            {getContentForSelectedTab()}

        </Container >

    )
}

export default User