// react
import { useState, useEffect } from "react";

const useSSRDetector = () => {    
    const [isSSR, setIsSSR] = useState(true);
    useEffect(() => {
        setIsSSR(false);
    }, []);

    return [isSSR]
}

export default useSSRDetector;