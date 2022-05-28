import { Container } from '@mui/material'
import { ReactNode } from 'react'
import Navbar from './Navbar'


interface LayoutProps {
    children: ReactNode,
    selectedTheme: any,
    setSelectedTheme: any
}

export default function Layout({ children, selectedTheme, setSelectedTheme }: LayoutProps) {
    return (
        <>
            <Navbar selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
            <Container component="main" sx={{
                marginTop: 2,
                padding: 2,
            }}>
                <main>{children}</main>
            </Container>
        </>
    )
}
