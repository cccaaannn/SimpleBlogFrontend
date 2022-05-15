// react
import { useState } from "react";
import { AlertColor } from "@mui/material";

const useAlertMessage = () => {    
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info" as any);
    const setMessageWithType = (message: string, type?: AlertColor) => {
        if(!type) {
            type = "info";
        }
        setAlertMessage(message);
        setAlertType(type);
    }

    return [alertMessage, alertType, setMessageWithType]
}

export default useAlertMessage;