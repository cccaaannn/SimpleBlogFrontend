/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next'
import { useRouter } from 'next/router';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { DataGrid, GridActionsCellItem, GridColDef, GridColumns, GridRowModes, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import { Tooltip } from '@mui/material';

import { ApiService } from '../../services/api-service';
import { AuthUtils } from '../../utils/auth-utils';
import { User } from '../../types/User';
import ConfirmDialog from '../../components/ConfirmDialog';
import Status from '../../types/enums/Status';
import Roles from '../../types/enums/Roles';


const Admin: NextPage = () => {

    // next
    const router = useRouter();

    // react
    const [allData, setAllData] = useState([] as User[]);
    const [loading, setLoading] = useState(true);

    const [rowCount, setRowCount] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [sortModel, setSortModel] = React.useState([{ field: 'createdAt', sort: 'asc' }] as GridSortModel); // Mui's table sort format

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState({} as User);
    const [selectedOperation, setSelectedOperation] = useState("" as ButtonType);


    useEffect(() => {
        fetchData();
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

        console.log("CSR");
        const response = await ApiService.fetcher(`/users/getAll?page=${selectedPage}&limit=${pageSize}${getSortPath()}`, {
            method: "get"
        });

        const jsonData = await response.json();

        console.log(jsonData);

        if (jsonData.status) {
            setRowCount(jsonData.data.totalItems)
            setAllData(jsonData.data.data);
        }
        else {
            // TODO error alert
            console.log("Error");
        }

        setLoading(false);
    }

    type ButtonType = "SUSPEND" | "ACTIVATE" | "DELETE"
    const onButtonClick = (buttonType: ButtonType, row: any) => {
        setSelectedRowData(row);
        setSelectedOperation(buttonType);
        setConfirmOpen(true);
    }


    const onConfirm = () => {
        console.log(selectedRowData);
        console.log(selectedOperation);
        
        setConfirmOpen(false);
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
                        onClick={() => onButtonClick("SUSPEND", row)}
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
                        onClick={() => onButtonClick("ACTIVATE", row)}
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
                        onClick={() => onButtonClick("DELETE", row)}
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
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            filterable: false,
            flex: 1,
        },
        {
            field: 'role',
            headerName: 'Role',
            type: 'number',
            filterable: false,
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            filterable: false,
            flex: 1,
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            type: 'dateTime',
            filterable: false,
            flex: 1,
            valueGetter: ({ value }) => value && new Date(value),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ row }) => getTableButtons(row),
        },
    ];


    return (
        <>
            <ConfirmDialog open={confirmOpen} setOpen={setConfirmOpen} onConfirm={() => onConfirm()} text={`${selectedRowData.username}`} title={`You sure want to ${selectedOperation} this user`} />

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

