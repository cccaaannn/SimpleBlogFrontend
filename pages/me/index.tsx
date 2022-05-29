/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next'

import * as React from 'react';
import { useEffect, useState } from 'react';

import { Box, Button, Divider, Grid, Pagination, Tab, Tabs, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CategoryArr } from '../../types/enums/Category';
import { ApiService } from '../../services/api-service';
import { AuthUtils } from '../../utils/auth-utils';
import UpdateAccountForm from '../../components/forms/UpdateAccountForm';
import AccountDeleteForm from '../../components/forms/AccountDeleteForm';
import useBreakpointDetector from '../../hooks/useBreakpointDetector';
import CategoriesMenu from '../../components/CategoriesMenu';
import PostCardMe from '../../components/Cards/PostCardMe';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../../components/AlertMessage';
import ComboBox from '../../components/ComboBox';


const User: NextPage = () => {

    // react
    const [allData, setAllData] = useState([1, 2, 3, 4, 5] as any[]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [pageCount, setPageCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedTab, setSelectedTab] = useState(0);

    // custom
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();
    const isMobile = useBreakpointDetector('md');


    useEffect(() => {
        fetchData();
    }, [selectedPage, pageSize, selectedCategory])

    useEffect(() => {
        setSelectedPage(1)
    }, [selectedCategory])

    useEffect(() => {
        if (allData.length == 0 || allData[0].owner) {
            setLoading(false);
        }
    }, [allData])


    const fetchData = async () => {
        setLoading(true);
        const id = AuthUtils.isLoggedIn() ? AuthUtils.getTokenPayload().id : "";

        const res = await ApiService.fetcher(`/posts/getByUserId/${id}?sort=createdAt&asc=-1&category=${selectedCategory}&page=${selectedPage}&limit=${pageSize}`, {
            method: "get"
        });
        const jsonData: any = await res.json();
        console.log(jsonData);

        if (jsonData.status) {
            setPageCount(jsonData.data.totalPages)
            setAllData(jsonData.data.data);
        }
        else {
            // TODO error alert
            console.log("Error");
        }

        setLoading(false);
    }

    const onDelete = async (postId: string) => {
        const res = await ApiService.fetcher(`/posts/delete/${postId}`, {
            method: "delete"
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
            posts.push(<PostCardMe post={post} onDelete={onDelete} loading={loading} key={key} />)
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
                    <Divider />
                    <AccountDeleteForm />
                </>
            )
        }
    }


    return (
        <>
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

            <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />
            {getContentForSelectedTab()}
        </>
    )
}


export default User
