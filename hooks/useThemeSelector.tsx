// react
import { useState, useEffect, useRef } from "react";

import { PaletteMode } from "@mui/material"; 
import { Storage } from "../utils/storage";
import { LocalStorageKeys } from "../types/enums/local-storage-keys";


const useThemeSelector = () => {
    const isFirstRender = useRef(true);
    const initialTheme = "light" as PaletteMode;
    const [selectedTheme, setSelectedTheme] = useState(initialTheme);
    useEffect(() => {
        // Check local storage on initial render
        if(isFirstRender.current) {
            const storageTheme = Storage.get(LocalStorageKeys.THEME);
            if(storageTheme == "dark" || storageTheme == "light") {
                setSelectedTheme(storageTheme)
            }
        }
        else {
            Storage.set(LocalStorageKeys.THEME, selectedTheme);
        }
        isFirstRender.current = false;
    }, [selectedTheme]);

    return [selectedTheme, setSelectedTheme] as const;
}

export default useThemeSelector;