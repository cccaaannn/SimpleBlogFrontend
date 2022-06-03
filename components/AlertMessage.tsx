import { Alert, Snackbar } from '@mui/material';


interface AlertProps {
    alertMessage: any,
    alertType: any,
    setMessageWithType: any
}

export default function AlertMessage({ alertMessage, alertType, setMessageWithType }: AlertProps) {
    return (
        <Snackbar open={alertMessage == "" ? false : true} autoHideDuration={5000} onClose={() => { setMessageWithType("") }}>
            <Alert severity={alertType} onClose={() => { setMessageWithType("") }}>{alertMessage}</Alert>
        </Snackbar>
    );
}