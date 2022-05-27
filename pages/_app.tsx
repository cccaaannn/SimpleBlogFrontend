import Head from 'next/head';
import type { AppProps } from 'next/app'

import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider } from '@mui/material';

import '../styles/globals.css'

import useThemeSelector from '../hooks/useThemeSelector';
import Layout from '../components/Layout'
import Guard from '../components/Guard';


function MyApp({ Component, pageProps }: AppProps) {
	const [selectedTheme, setSelectedTheme] = useThemeSelector();

	let theme = createTheme({
		palette: {
			mode: selectedTheme,
			primary: {
				main: "#009688"
			},
			secondary: {
				// main: '#00897B',
				main: '#4DD0E1'
			}
		}
	});
	theme = responsiveFontSizes(theme);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Head>
				<title>Simple Blog</title>
			</Head>
			<Guard>
				<Layout selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} >
					<Component {...pageProps} />
				</Layout>
			</Guard>
		</ThemeProvider>
	)
}

export default MyApp
