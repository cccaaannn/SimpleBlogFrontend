// react
import { useState } from "react";

const useAlertMessage = () => {    
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info" as any);
    return [alertMessage, setAlertMessage, alertType, setAlertType]
}

export default useAlertMessage;