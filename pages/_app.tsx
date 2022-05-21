import type { AppProps } from 'next/app'
import '../styles/globals.css'

import Layout from '../components/Layout'
import { createTheme, ThemeProvider } from '@mui/material';
import Head from 'next/head';


function MyApp({ Component, pageProps }: AppProps) {
	const theme = createTheme({
		palette: {
			primary: {
				main: "#009688"
			},
			secondary: {
				// main: '#00897B',
				main: '#4DD0E1'
			}
		}
	});

	return (
		<ThemeProvider theme={theme}>
			<Head>
				<title>Simple Blog</title>
			</Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	)
}

export default MyApp
