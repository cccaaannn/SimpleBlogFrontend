import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface ResponsiveDialogProps {
    open: any,
    setOpen: any,
    title: any,
    text: any,
    onConfirm: any
}

export default function ConfirmDialog({ open, setOpen, title, text, onConfirm }: ResponsiveDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={()=>setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}