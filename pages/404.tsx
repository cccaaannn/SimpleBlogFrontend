import { Card, Divider, Typography } from "@mui/material";

import useBreakpointDetector from "../hooks/useBreakpointDetector";


export default function Custom404() {
    const isMobile = useBreakpointDetector('md');

    return (
        <Card sx={{ mt: 5, py: 3, px: 1 }} >
            <Typography align="center" variant="h1" sx={!isMobile ? { mb: 2, fontSize: [220, "!important"] } : { mb: 2, fontSize: [150, "!important"] }} >
                404
            </Typography>
            <Divider />
            <Typography align="center" variant="h6">
                There is nothing here
            </Typography>
        </Card >
    )
}