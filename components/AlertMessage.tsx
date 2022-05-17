import Zoom from '@mui/material/Zoom';
import { Alert } from '@mui/material';

interface AlertProps {
    alertMessage: any,
    alertType: any,
    setMessageWithType: any
}

export default function AlertMessage({ alertMessage, alertType, setMessageWithType }: AlertProps) {
    return (
        <Zoom in={alertMessage == "" ? false : true}>
            <Alert severity={alertType} onClose={() => { setMessageWithType("") }}>{alertMessage}</Alert>
        </Zoom>
    );
}