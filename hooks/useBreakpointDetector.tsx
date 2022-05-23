import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useBreakpointDetector = (breakpoint: Breakpoint) => {    
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down(breakpoint));

    return matches
}

export default useBreakpointDetector;