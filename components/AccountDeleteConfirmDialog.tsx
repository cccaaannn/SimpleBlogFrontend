import * as React from 'react';
import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthUtils } from '../utils/auth-utils';


interface AccountDeleteConfirmDialogProps {
    open: any,
    setOpen: any,
    onConfirm: any
}

export default function AccountDeleteConfirmDialog({ open, setOpen, onConfirm }: AccountDeleteConfirmDialogProps) {

    const [enteredText, setEnteredText] = useState("");
    const textToMatch = AuthUtils.isLoggedIn() ? AuthUtils.getTokenPayload().username : "";

    const onMatch = () => {
        if (isMatching()) {
            onConfirm();
            setOpen(false);
        }
    }

    const isMatching = () => {
        if (enteredText == textToMatch) {
            return true;
        }
        return false;
    }
    
    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{"Delete your account?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText gutterBottom>
                        {"Are you sure you want to delete your account, all of your posts and comments also WILL be deleted."}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="dialog-text-field"
                        label={`Please type '${textToMatch}'`}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setEnteredText(e.target.value)}
                        error={!isMatching()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => onMatch()} disabled={!isMatching()} >Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}