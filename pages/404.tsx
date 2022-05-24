import { Container, Typography } from "@mui/material";

export default function Custom404() {
    return (
        <Container component="div" sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: 5 }}>
            <Typography align="center" variant="h1" sx={{fontWeight: 'bold' }}>
                404 - Not Found
            </Typography>
        </Container>
    )
}