/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useState, useEffect } from 'react';

import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import { RolesArr } from '../types/enums/Roles';
import { User } from '../types/User';
import ComboBox from './ComboBox';


interface ChangeRoleConfirmDialogProps {
    open: any,
    setOpen: any,
    user: User,
    onConfirm: any
}

export default function ChangeRoleConfirmDialog({ open, setOpen, user, onConfirm }: ChangeRoleConfirmDialogProps) {
    const [selected, setSelected] = useState("");

    useEffect(() => {
        if(user && user.role) {
            setSelected(user.role);
        }
    }, [open])

    const _onConfirm = () => {
        onConfirm(selected);
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{"Change the role"}</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom sx={{ mb: 2 }} >
                    {`Choose a new role for user '${user.username}'`}
                </DialogContentText>
                <ComboBox
                    inputsList={RolesArr}
                    name={"Roles"}
                    selected={selected}
                    setSelected={setSelected}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => _onConfirm()}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}