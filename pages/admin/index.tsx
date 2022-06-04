/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next'

import * as React from 'react';
import { useEffect, useState } from 'react';

import { DataGrid, GridActionsCellItem, GridColumns, GridSortModel } from '@mui/x-data-grid';
import { Divider, Tooltip, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';

import { ApiService } from '../../services/api-service';
import { AuthUtils } from '../../utils/auth-utils';
import { Roles } from '../../types/enums/Roles';
import { User } from '../../types/User';
import ChangeRoleConfirmDialog from '../../components/ChangeRoleConfirmDialog';
import useBreakpointDetector from '../../hooks/useBreakpointDetector';
import ConfirmDialog from '../../components/ConfirmDialog';
import useAlertMessage from '../../hooks/useAlertMessage';
import AlertMessage from '../../components/AlertMessage';
import Status from '../../types/enums/Status';


const Admin: NextPage = () => {

    // react
    const [allData, setAllData] = useState([] as User[]);
    const [loading, setLoading] = useState(true);

    const [rowCount, setRowCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [sortModel, setSortModel] = React.useState([{ field: 'createdAt', sort: 'asc' }] as GridSortModel); // Mui's table sort format

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [changeRoleConfirmOpen, setChangeRoleConfirmOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState({} as User);
    const [selectedOperation, setSelectedOperation] = useState("" as ButtonType);

    const [headerText, setHeaderText] = useState("Admin");

    // Custom
    const [alertMessage, alertType, setMessageWithType] = useAlertMessage();
    const isMobile = useBreakpointDetector('md');


    useEffect(() => {
        fetchData();
        AuthUtils.isRole(Roles.SYS_ADMIN) && setHeaderText("SYS Admin");
    }, [selectedPage, pageSize, sortModel])

    useEffect(() => {
        if (allData.length == 0 || allData[0]._id) {
            setLoading(false);
        }
    }, [allData])


    const getSortPath = () => {
        let path = "";
        if (sortModel.length != 0) {
            path = `&sort=${sortModel[0].field}&asc=${sortModel[0].sort == "asc" ? 1 : -1}`
        }
        return path;
    }


    const fetchData = async () => {
        setLoading(true);

        const response = await ApiService.get(`/users/getAll?page=${selectedPage}&limit=${pageSize}${getSortPath()}`);

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setRowCount(jsonData.data.totalItems)
            setAllData(jsonData.data.data);
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }

        setLoading(false);
    }

    type ButtonType = "suspend" | "activate" | "delete" | "change-role"
    const onButtonClick = (buttonType: ButtonType, row: any) => {
        setSelectedRowData(row);
        setSelectedOperation(buttonType);

        if(buttonType == "change-role") {
            setChangeRoleConfirmOpen(true);
        }
        else {
            setConfirmOpen(true);
        }
        
    }

    const onConfirm = async (confirmItem?: any) => {
        console.log(selectedRowData);
        console.log(selectedOperation);

        const selectedUserId = selectedRowData._id;

        let response: any;
        if (selectedOperation == "suspend") {
            response = await ApiService.put(`/users/suspend/${selectedUserId}`);
        }

        if (selectedOperation == "activate") {
            response = await ApiService.put(`/users/activate/${selectedUserId}`);
        }

        if (selectedOperation == "delete") {
            response = await ApiService.delete(`/users/purge/${selectedUserId}`);
        }

        if (selectedOperation == "change-role") {
            response = await ApiService.put(`/users/changeRole/${selectedUserId}/${confirmItem}`);
        }

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.status) {
            setMessageWithType("Operation successful", "success");
            fetchData();
        }
        else {
            setMessageWithType(jsonData.message, "error");
        }

    }


    const getTableButtons = (row: any): any => {
        const status: string = row.status;
        const role: string = row.role;
        
        let actions = [];

        if (status == Status.ACTIVE && (role != Roles.SYS_ADMIN || AuthUtils.isRole(Roles.SYS_ADMIN))) {
            actions.push(
                <Tooltip title="Suspend user" key={1}>
                    <GridActionsCellItem
                        icon={<PauseIcon />}
                        label="Suspend"
                        className="textPrimary"
                        onClick={() => onButtonClick("suspend", row)}
                        color="primary"
                    />
                </Tooltip>
            )
        }

        if ((status == Status.SUSPENDED || status == Status.PASSIVE) && (role != Roles.SYS_ADMIN || AuthUtils.isRole(Roles.SYS_ADMIN))) {
            actions.push(
                <Tooltip title="Activate user" key={1}>
                    <GridActionsCellItem
                        icon={<PlayArrowIcon />}
                        label="Activate"
                        onClick={() => onButtonClick("activate", row)}
                        color="primary"
                    />
                </Tooltip>
            )
        }

        if (role != Roles.SYS_ADMIN || AuthUtils.isRole(Roles.SYS_ADMIN)) {
            actions.push(
                <Tooltip title="Delete user" key={1}>
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        className="textPrimary"
                        onClick={() => onButtonClick("delete", row)}
                        color="inherit"
                    />
                </Tooltip>
            )
        }

        if (AuthUtils.isRole(Roles.SYS_ADMIN)) {
            actions.push(
                <Tooltip title="Change role" key={1}>
                    <GridActionsCellItem
                        icon={<FactCheckIcon />}
                        label="Change role"
                        className="textPrimary"
                        onClick={() => onButtonClick("change-role", row)}
                        color="inherit"
                    />
                </Tooltip>
            )
        }

        return actions;
    }


    const columns: GridColumns = [
        {
            field: 'username',
            headerName: 'username',
            filterable: false,
            flex: isMobile ? 0 : 1,
            width: 150
        },
        {
            field: 'email',
            headerName: 'Email',
            filterable: false,
            flex: isMobile ? 0 : 1,
            width: 200
        },
        {
            field: 'role',
            headerName: 'Role',
            type: 'number',
            filterable: false,
            flex: isMobile ? 0 : 1,
            width: 100
        },
        {
            field: 'status',
            headerName: 'Status',
            filterable: false,
            flex: isMobile ? 0 : 1,
            width: 100
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            type: 'dateTime',
            filterable: false,
            flex: isMobile ? 0 : 1,
            width: 200,
            valueGetter: ({ value }) => value && new Date(value)
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            width: 120,
            getActions: ({ row }) => getTableButtons(row)
        },
    ];


    return (
        <>
            <Typography variant="h2" component="div" sx={{ mb: 1 }}>
                {headerText}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <ChangeRoleConfirmDialog open={changeRoleConfirmOpen} setOpen={setChangeRoleConfirmOpen} user={selectedRowData} onConfirm={(newRole: Roles) => onConfirm(newRole)} />
            <ConfirmDialog open={confirmOpen} setOpen={setConfirmOpen} onConfirm={() => onConfirm()} text={`${selectedRowData.username}`} title={`You sure want to ${selectedOperation} this user`} />
            <AlertMessage alertMessage={alertMessage} alertType={alertType} setMessageWithType={setMessageWithType} />

            <DataGrid
                getRowId={(row) => row._id}
                rows={allData}
                columns={columns}

                loading={loading}

                // Sort
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}

                // Pagination
                paginationMode={'server'}
                rowsPerPageOptions={[3, 5, 10, 50]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pageSize={pageSize}

                rowCount={rowCount}
                page={selectedPage - 1}
                onPageChange={(newPage) => setSelectedPage(newPage + 1)}

                autoHeight
                disableSelectionOnClick
            />
        </>

    )
}


export default Admin

