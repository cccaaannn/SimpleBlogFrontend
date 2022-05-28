/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next'
import { useRouter } from 'next/router';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { DataGrid, GridActionsCellItem, GridColDef, GridColumns, GridRowModes, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Container } from '@mui/system'

import { ApiUtils } from '../../utils/api-utils';
import { LocalStorageKeys } from '../../types/enums/local-storage-keys';
import { Storage } from '../../utils/storage';
import { User } from '../../types/User';
import Roles from '../../types/enums/Roles';
import Status from '../../types/enums/Status';
import { Tooltip } from '@mui/material';
import { AuthUtils } from '../../utils/auth-utils';
import ConfirmDialog from '../../components/ConfirmDialog';


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
        const token = Storage.get(LocalStorageKeys.TOKEN) || "";

        const response = await fetch(`${ApiUtils.getApiUrl()}/users/getAll?page=${selectedPage}&limit=${pageSize}${getSortPath()}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
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

        if (status == Status.ACTIVE && (role != Roles.SYS_ADMIN || AuthUtils.isSysAdmin())) {
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

        if ((status == Status.SUSPENDED || status == Status.PASSIVE) && (role != Roles.SYS_ADMIN || AuthUtils.isSysAdmin())) {
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

        if (role != Roles.SYS_ADMIN || AuthUtils.isSysAdmin()) {
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

