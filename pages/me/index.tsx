import * as React from 'react';
import { useEffect, useState } from 'react';

import { Box, Button, Grid, Pagination, Tab, Tabs, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { ApiUtils } from '../../utils/api-utils';
import { AuthUtils } from '../../utils/auth-utils';
import { Storage } from '../../utils/storage';
import useAlertMessage from '../../hooks/useAlertMessage';
import { CategoryArr } from '../../types/enums/Category';
import UpdateAccountForm from '../../components/forms/UpdateAccountForm';
import CategoriesMenu from '../../components/CategoriesMenu';
import PostCardMe from '../../components/Cards/PostCardMe';
import AlertMessage from '../../components/AlertMessage';
import usePagination from '../../hooks/usePagination';
import AccountDeleteForm from '../../components/forms/AccountDeleteForm';
import ComboBox from '../../components/ComboBox';
import useBreakpointDetector from '../../hooks/useBreakpointDetector';


const User = () => {

    const [allData, setAllData] = useState([1, 2, 3, 4, 5] as any[]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);

    const isMobile = useBreakpointDetector('md');

    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);


    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();

    useEffect(() => {
        if (AuthUtils.isLoggedIn()) {
            fetchData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPage, pageSize, selectedCategory])

    useEffect(() => {
        setSelectedPage(1)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory])

    useEffect(() => {
        if (allData.length == 0 || allData[0].owner) {
            setLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allData])


    const fetchData = async () => {
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";

        const id = AuthUtils.isLoggedIn() ? AuthUtils.getTokenPayload().id : "";

        const res = await fetch(`${ApiUtils.getApiUrl()}/posts/getByUserId/${id}?sort=createdAt&asc=-1&category=${selectedCategory}&page=${selectedPage}&limit=${pageSize}`, {
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
        }

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
        allData.map((post: any, key: any) => {
            posts.push(<PostCardMe post={post} onDelete={onDelete} loading={loading} />)
        })
        return posts
    }

    const getContentForSelectedTab = () => {
        if (selectedTab == 0) {
            return (
                <Grid container spacing={1} >
                    <Grid item xs={8} md={10} sx={{ mb: 1 }}>
                        {isMobile &&
                            <ComboBox
                                name='Categories'
                                inputsList={CategoryArr}
                                selected={selectedCategory}
                                setSelected={setSelectedCategory}
                            />
                        }
                    </Grid>
                    <Grid item xs={4} md={2} sx={{ mb: 1 }}>
                        <Tooltip title="Create new post">
                            <Button
                                href='/me/add-post'
                                variant="contained"
                                size="large"
                                sx={{ mb: 1, float: 'right' }}
                            >
                                New
                            </Button>
                        </Tooltip>
                    </Grid>

                    <Grid container xs={12} md={12} item spacing={3} >
                        {!isMobile &&
                            <Grid item md={3} >

                                <CategoriesMenu
                                    selected={selectedCategory}
                                    setSelected={setSelectedCategory}
                                    loading={loading}
                                />

                            </Grid>
                        }

                        <Grid item xs={12} md={9} >
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
                    </Grid>

                </Grid >
            )
        }
        if (selectedTab == 1) {
            return (
                <>
                    <UpdateAccountForm
                        setMessageWithType={setMessageWithType}
                    />
                    <hr />
                    <AccountDeleteForm />
                </>
            )
        }
    }


    return (
        <Container component="main" sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
        }}>

            <Typography variant="h2" component="div" sx={{ mb: 2 }}>
                Account
            </Typography>

            <Box sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={(e, value) => setSelectedTab(value)} aria-label="basic tabs example">
                        <Tab label="My post" value={0} />
                        <Tab label="Settings" value={1} />
                    </Tabs>
                </Box>
            </Box>

            {(alertMessage != "") && <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />}
            {getContentForSelectedTab()}
        </Container >

    )
}

export default User
